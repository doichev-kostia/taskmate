import { z } from "zod";

export const UserRepresentationValidator = z.object({
	id: z.string(),
	email: z.string().nullish(),
	firstName: z.string().nullish(),
	lastName: z.string().nullish(),
	profileImageUrl: z.string().nullish(),
});

export type UserRepresentation = z.infer<typeof UserRepresentationValidator>;
