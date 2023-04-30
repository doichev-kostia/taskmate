import { z } from "zod";

export const AssigneeRepresentationValidator = z.object({
	id: z.string().uuid(),
	issueId: z.string().uuid(),
	memberId: z.string().uuid(),
});
