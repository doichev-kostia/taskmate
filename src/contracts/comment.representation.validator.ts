import { z } from "zod";

export const CommentRepresentationValidator = z.object({
	id: z.number(),
	createdAt: z.date(),
	content: z.string(),
	issueId: z.number(),
	creator: z.object({
		id: z.number(),
	}),
});

export type CommentRepresentation = z.infer<typeof CommentRepresentationValidator>;
