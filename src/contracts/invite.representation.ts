import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const InviteRepresentation = z.object({
	id: z.string().uuid(),
	role: z.enum(Object.values(MemberRole)),
	boardId: z.string().uuid(),
});
