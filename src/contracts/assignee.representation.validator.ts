import { z } from "zod";

export const AssigneeRepresentationValidator = z.object({
	id: z.number(),
	issueId: z.number(),
	member: z.object({
		id: z.number(),
	}),
});

export type AssigneeRepresentation = z.infer<typeof AssigneeRepresentationValidator>;
