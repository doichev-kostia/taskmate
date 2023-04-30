import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { BoardBodyValidator } from "~/contracts/board.body.validator";
import { AttachMemberBodyValidator } from "~/contracts/attach-member.body.validator";
import { hasAccessToBoardRequirement } from "~/server/requirements/has-access-to-board.requirement";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hasBoardEditRightsRequirement } from "~/server/requirements/has-board-edit-rights.requirement";
import clerk from "@clerk/clerk-sdk-node";
import { UpdateMemberBodyValidator } from "~/contracts/update-member.body.validator";
import { BoardDetailedRepresentation, BoardRepresentation } from "~/contracts/board.representation";
import { MemberRepresentation } from "~/contracts/member.representation";
import { InviteRepresentation } from "~/contracts/invite.representation";

export const boardsRouter = createTRPCRouter({
	createBoard: privateProcedure
		.input(BoardBodyValidator)
		.output(BoardRepresentation)
		.mutation(async function createBoard({ ctx, input }) {
			const board = await ctx.prisma.board.create({
				data: {
					name: input.name,
					imageUrl: input.imageUrl,
				},
			});

			await ctx.prisma.member.create({
				data: {
					boardId: board.id,
					userId: ctx.auth.userId,
					role: "OWNER",
				},
			});

			return board;
		}),
	updateBoard: privateProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				board: BoardBodyValidator.partial(),
			})
		)
		.output(BoardRepresentation)
		.use(async function updateBoardRequirements({ ctx, input, next }) {
			await hasBoardEditRightsRequirement({
				userId: ctx.auth.userId,
				boardId: input.id,
			});

			return next();
		})
		.mutation(async function updateBoard({ ctx, input }) {
			const board = await ctx.prisma.board.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.board.name,
					imageUrl: input.board.imageUrl,
				},
			});

			return board;
		}),
	updateMember: privateProcedure
		.input(UpdateMemberBodyValidator)
		.output(MemberRepresentation)
		.use(async function attachMemberRequirements({ ctx, input, next }) {
			await hasBoardEditRightsRequirement({
				userId: ctx.auth.userId,
				boardId: input.boardId,
			});

			return next();
		})
		.mutation(async function updateMember({ ctx, input }) {
			const member = await ctx.prisma.member.update({
				where: {
					id: input.memberId,
				},
				data: {
					role: input.role,
				},
			});

			return member;
		}),
	attachMember: privateProcedure
		.input(AttachMemberBodyValidator)
		.output(InviteRepresentation)
		.use(async function attachMemberRequirements({ ctx, input, next }) {
			await hasBoardEditRightsRequirement({
				userId: ctx.auth.userId,
				boardId: input.boardId,
			});

			return next();
		})
		.mutation(async function attachMember({ ctx, input }) {
			const invite = await ctx.prisma.invite.create({
				data: {
					boardId: input.boardId,
					role: input.invite.role,
				},
			});

			return invite;
		}),
	getBoards: privateProcedure.output(z.array(BoardRepresentation)).query(async function getBoards({ ctx }) {
		const boards = await ctx.prisma.board.findMany({
			where: {
				members: {
					some: {
						userId: ctx.auth.userId,
					},
				},
			},
		});

		return boards;
	}),
	getBoard: privateProcedure
		.input(z.string())
		.output(BoardDetailedRepresentation)
		.use(async function getBoardRequirements({ ctx, input, next }) {
			await hasAccessToBoardRequirement({
				userId: ctx.auth.userId,
				boardId: input,
			});

			return next();
		})
		.query(async function getBoard({ ctx, input }) {
			const board = await ctx.prisma.board.findUnique({
				where: {
					id: input,
				},
				include: {
					members: true,
					issues: true,
				},
			});

			if (!board) {
				throw new TRPCError({
					code: "NOT_FOUND",
				});
			}

			board.members = await Promise.all(
				board.members.map(async (member) => {
					const user = await clerk.users.getUser(member.userId);
					return {
						...member,
						profileImageUrl: user.profileImageUrl,
						firstName: user.firstName,
						lastName: user.lastName,
					};
				})
			);

			return board;
		}),
	removeBoard: privateProcedure
		.input(z.string())
		.use(async function removeBoardRequirements({ ctx, input, next }) {
			await hasBoardEditRightsRequirement({
				userId: ctx.auth.userId,
				boardId: input,
			});

			return next();
		})
		.mutation(async function removeBoard({ ctx, input }) {
			await ctx.prisma.board.delete({
				where: {
					id: input,
				},
			});
		}),
	removeMember: privateProcedure
		.input(z.string())
		.use(async function removeMemberRequirements({ ctx, input, next }) {
			await hasBoardEditRightsRequirement({
				userId: ctx.auth.userId,
				boardId: input,
			});

			return next();
		})
		.mutation(async function removeMember({ ctx, input }) {
			await ctx.prisma.member.delete({
				where: {
					id: input,
				},
			});
		}),
});
