import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const UpdateMemberBodyValidator = z.object({
	boardId: z.string().uuid(),
	memberId: z.string().uuid(),
	role: z.enum(Object.values(MemberRole)),
});
