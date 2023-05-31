import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const MemberRepresentationValidator = z.object({
	id: z.number(),
	role: z.enum(Object.values(MemberRole)),
	userId: z.string(),
	boardId: z.number(),
});

export const MemberDetailedRepresentationValidator = MemberRepresentationValidator.extend({
	user: z.object({
		id: z.string(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		profileImageUrl: z.string().url().nullish(),
	}),
});

export type MemberRepresentation = z.infer<typeof MemberRepresentationValidator>;

export type MemberDetailedRepresentation = z.infer<typeof MemberDetailedRepresentationValidator>;
