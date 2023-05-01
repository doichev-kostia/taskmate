import { z } from "zod";

export const CommentBodyValidator = z.object({
	content: z.string().min(1),
	issueId: z.string().uuid(),
});

export const EditCommentBodyValidator = z.object({
	content: z.string(),
	commentId: z.string().uuid(),
	issueId: z.string().uuid(),
});

export const DeleteCommentBodyValidator = z.object({
	commentId: z.string().uuid(),
});
