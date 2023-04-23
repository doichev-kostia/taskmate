import { z } from "zod";

export const BoardBodyValidator = z.object({
	name: z.string(),
	imageUrl: z.string().optional(),
});
