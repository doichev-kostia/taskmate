import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { IssueBodyValidator } from "~/contracts/issue.body.validator";
import { hasAccessToBoardRequirement } from "~/server/requirements/has-access-to-board.requirement";
import {
	IssueDetailedRepresentationValidator,
	IssueRepresentationValidator,
} from "~/contracts/issue.representation.validator";
import { TRPCError } from "@trpc/server";
import { UpdateIssueBodyValidator } from "~/contracts/update-issue.body.validator";
import { z } from "zod";
import { AssigneeBodyValidator, DeleteAssigneeBodyValidator } from "~/contracts/assignee.body.validator";
import {
	CommentBodyValidator,
	DeleteCommentBodyValidator,
	EditCommentBodyValidator,
} from "~/contracts/comment.body.validator";
import { hasAccessToIssueRequirement } from "~/server/requirements/has-access-to-issue.requirement";
import { hasAccessToCommentRequirement } from "~/server/requirements/has-access-to-comment.requirement";
import { CommentRepresentationValidator } from "~/contracts/comment.representation.validator";

export const issuesRouter = createTRPCRouter({
	create: privateProcedure
		.input(IssueBodyValidator)
		.use(async function createIssueRequirement({ ctx, input, next }) {
			await hasAccessToBoardRequirement({
				userId: ctx.auth.userId,
				boardId: input.boardId,
			});

			return next();
		})
		.output(IssueRepresentationValidator)
		.mutation(async function createIssue({ ctx, input }) {
			const member = await ctx.prisma.member.findFirst({
				where: {
					userId: ctx.auth.userId,
					boardId: input.boardId,
				},
			});

			if (!member) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Member not found",
				});
			}
			const issue = await ctx.prisma.issue.create({
				data: {
					title: input.title,
					description: input.description,
					boardId: input.boardId,
					status: input.status,
					creatorId: member.id,
				},
			});

			return issue;
		}),
	update: privateProcedure
		.input(UpdateIssueBodyValidator)
		.use(async function updateIssueRequirement({ ctx, input, next }) {
			await hasAccessToBoardRequirement({
				userId: ctx.auth.userId,
				boardId: input.boardId,
			});

			return next();
		})
		.output(IssueRepresentationValidator)
		.mutation(async function updateIssue({ ctx, input }) {
			const issue = await ctx.prisma.issue.update({
				where: {
					id: input.issueId,
				},
				data: {
					title: input.issue.title,
					description: input.issue.description,
				},
			});

			return issue;
		}),
	getIssue: privateProcedure
		.input(
			z.object({
				issueId: z.string().uuid(),
				boardId: z.string().uuid(),
			})
		)
		.use(async function getIssueRequirement({ ctx, input, next }) {
			await hasAccessToBoardRequirement({
				userId: ctx.auth.userId,
				boardId: input.boardId,
			});

			return next();
		})
		.output(IssueDetailedRepresentationValidator)
		.query(async function getIssue({ ctx, input }) {
			const issue = await ctx.prisma.issue.findFirst({
				where: {
					id: input.issueId,
					boardId: input.boardId,
				},
				include: {
					assignees: true,
					creator: true,
					comments: true,
				},
			});

			if (!issue) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Issue not found",
				});
			}

			return issue;
		}),
	deleteIssue: privateProcedure
		.input(
			z.object({
				issueId: z.string().uuid(),
				boardId: z.string().uuid(),
			})
		)
		.use(async function deleteIssueRequirement({ ctx, input, next }) {
			await hasAccessToBoardRequirement({
				userId: ctx.auth.userId,
				boardId: input.boardId,
			});

			return next();
		})
		.mutation(async function deleteIssue({ ctx, input }) {
			await ctx.prisma.issue.delete({
				where: {
					id: input.issueId,
				},
			});
		}),
	addAssignee: privateProcedure
		.input(AssigneeBodyValidator)
		.use(async function addAssigneeRequirement({ ctx, input, next }) {
			await hasAccessToIssueRequirement({
				userId: ctx.auth.userId,
				issueId: input.issueId,
			});

			const member = await ctx.prisma.member.findFirst({
				where: {
					id: input.memberId,
				},
			});

			if (!member) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Member not found",
				});
			}
			// the assigned user must be a member of the board
			await hasAccessToIssueRequirement({
				userId: member.userId,
				issueId: input.issueId,
			});

			return next();
		})
		.mutation(async function addAssignee({ ctx, input }) {
			await ctx.prisma.assignee.create({
				data: {
					issueId: input.issueId,
					memberId: input.memberId,
				},
			});
		}),
	deleteAssignee: privateProcedure
		.input(DeleteAssigneeBodyValidator)
		.use(async function deleteAssigneeRequirement({ ctx, input, next }) {
			await hasAccessToIssueRequirement({
				userId: ctx.auth.userId,
				issueId: input.issueId,
			});

			return next();
		})
		.mutation(async function deleteAssignee({ ctx, input }) {
			await ctx.prisma.assignee.delete({
				where: {
					id: input.assigneeId,
				},
			});
		}),
	addComment: privateProcedure
		.input(CommentBodyValidator)
		.use(async function addCommentRequirement({ ctx, input, next }) {
			await hasAccessToIssueRequirement({
				userId: ctx.auth.userId,
				issueId: input.issueId,
			});

			return next();
		})
		.output(CommentRepresentationValidator)
		.mutation(async function addComment({ ctx, input }) {
			const comment = await ctx.prisma.comment.create({
				data: {
					issueId: input.issueId,
					creatorId: ctx.auth.userId,
					content: input.content,
				},
			});

			return comment;
		}),
	editComment: privateProcedure
		.input(EditCommentBodyValidator)
		.use(async function editCommentRequirement({ ctx, input, next }) {
			await hasAccessToCommentRequirement({
				userId: ctx.auth.userId,
				commentId: input.commentId,
			});

			return next();
		})
		.output(CommentRepresentationValidator)
		.mutation(async function editComment({ ctx, input }) {
			const comment = await ctx.prisma.comment.update({
				where: {
					id: input.commentId,
				},
				data: {
					content: input.content,
				},
			});

			return comment;
		}),
	deleteComment: privateProcedure
		.input(DeleteCommentBodyValidator)
		.use(async function deleteCommentRequirement({ ctx, input, next }) {
			await hasAccessToCommentRequirement({
				userId: ctx.auth.userId,
				commentId: input.commentId,
			});

			return next();
		})
		.mutation(async function deleteComment({ ctx, input }) {
			await ctx.prisma.comment.delete({
				where: {
					id: input.commentId,
				},
			});
		}),
});
