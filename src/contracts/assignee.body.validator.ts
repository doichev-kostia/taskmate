import { z } from "zod";

export const AssigneeBodyValidator = z.object({
	memberId: z.number(),
});

export type AssigneeBody = z.infer<typeof AssigneeBodyValidator>;
