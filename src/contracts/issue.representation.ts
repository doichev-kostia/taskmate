import { z } from "zod";
import { Status } from "@prisma/client";

export const IssueRepresentation = z.object({
	id: z.string().uuid(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	title: z.string(),
	description: z.string(),
	status: z.enum(Object.values(Status)),
	creatorId: z.string().uuid().optional(),
	boardId: z.string().uuid(),
});
