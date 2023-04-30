import { z } from "zod";
import { Status } from "@prisma/client";
import { AssigneeRepresentationValidator } from "~/contracts/assignee.representation.validator";
import { MemberRepresentationValidator } from "~/contracts/member.representation.validator";
import { CommentRepresentationValidator } from "~/contracts/comment.representation.validator";

export const IssueRepresentationValidator = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
	title: z.string(),
	description: z.string(),
	status: z.enum(Object.values(Status)),
	creatorId: z.string().uuid().nullish(),
	boardId: z.string().uuid(),
});

export const IssueDetailedRepresentationValidator = IssueRepresentationValidator.extend({
	assignees: z.array(AssigneeRepresentationValidator),
	creator: MemberRepresentationValidator.nullish(),
	comments: z.array(CommentRepresentationValidator),
});
