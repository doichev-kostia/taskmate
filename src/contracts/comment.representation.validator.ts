import { z } from "zod";

export const CommentRepresentationValidator = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	content: z.string(),
	issueId: z.string().uuid(),
	creatorId: z.string().uuid(),
});
