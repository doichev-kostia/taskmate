import { z } from "zod";

export const AssigneeBodyValidator = z.object({
	issueId: z.string().uuid(),
	memberId: z.string().uuid(),
});

export const DeleteAssigneeBodyValidator = z.object({
	issueId: z.string().uuid(),
	assigneeId: z.string().uuid(),
});
