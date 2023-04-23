import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const InviteBodyValidator = z.object({
	email: z.string().email(),
	role: z.enum(Object.values(MemberRole)),
});
