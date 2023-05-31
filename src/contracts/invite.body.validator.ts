import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const InviteBodyValidator = z.object({
	memberRole: z.enum(Object.values(MemberRole)),
});

export type InviteBody = z.infer<typeof InviteBodyValidator>;
