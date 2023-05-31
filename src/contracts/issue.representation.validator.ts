import { z } from "zod";
import { Status } from "@prisma/client";
import { AssigneeRepresentationValidator } from "~/contracts/assignee.representation.validator";
import { MemberRepresentationValidator } from "~/contracts/member.representation.validator";
import { CommentRepresentationValidator } from "~/contracts/comment.representation.validator";

export const IssueRepresentationValidator = z.object({
	id: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	title: z.string(),
	description: z.string(),
	status: z.enum(Object.values(Status)),
	creatorId: z.number().nullish(),
	boardId: z.number(),
});

export type IssueRepresentation = z.infer<typeof IssueRepresentationValidator>;

export const IssueDetailedRepresentationValidator = IssueRepresentationValidator.extend({
	assignees: z.array(AssigneeRepresentationValidator),
	creator: MemberRepresentationValidator.nullish(),
	comments: z.array(CommentRepresentationValidator),
});

export type IssueDetailedRepresentation = z.infer<typeof IssueDetailedRepresentationValidator>;
