import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const InviteBodyValidator = z.object({
	role: z.enum(Object.values(MemberRole)),
});
