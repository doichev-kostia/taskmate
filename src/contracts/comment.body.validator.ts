import { z } from "zod";

export const CommentBodyValidator = z.object({
	content: z.string().min(1),
	creatorId: z.number(),
});

export type CommentBody = z.infer<typeof CommentBodyValidator>;
