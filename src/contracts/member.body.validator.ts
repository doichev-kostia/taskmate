import { z } from "zod";

export const MemberBodyValidator = z
	.object({
		id: z.string().uuid().optional(),
		userId: z.string().optional(),
	})
	.refine((data) => {
		return data.id || data.userId;
	});
