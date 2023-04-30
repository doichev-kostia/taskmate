import { z } from "zod";
import { Status } from "@prisma/client";

export const IssueRepresentation = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
	title: z.string(),
	description: z.string(),
	status: z.enum(Object.values(Status)),
	creatorId: z.string().uuid().nullish(),
	boardId: z.string().uuid(),
});
