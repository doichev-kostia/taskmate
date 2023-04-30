import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const MemberRepresentationValidator = z.object({
	id: z.string().uuid(),
	role: z.enum(Object.values(MemberRole)),
	userId: z.string(),
	boardId: z.string().uuid(),
});

export const MemberDetailedRepresentationValidator = MemberRepresentationValidator.extend({
	firstName: z.string().nullish(),
	lastName: z.string().nullish(),
	profileImageUrl: z.string().url().nullish(),
});
