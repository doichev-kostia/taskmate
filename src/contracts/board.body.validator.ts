import { z } from "zod";

export const BoardBodyValidator = z.object({
	name: z.string(),
	imageUrl: z.string(),
});

export type BoardBody = z.infer<typeof BoardBodyValidator>;
