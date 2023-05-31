import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const UpdateMemberBodyValidator = z.object({
	role: z.enum(Object.values(MemberRole)),
});

export type UpdateMemberBody = z.infer<typeof UpdateMemberBodyValidator>;
