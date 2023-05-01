import { z } from "zod";
import { Status } from "@prisma/client";

export const IssueBodyValidator = z.object({
	boardId: z.string().uuid(),
	title: z.string(),
	description: z.string(),
	status: z.enum(Object.values(Status)).optional(),
});
