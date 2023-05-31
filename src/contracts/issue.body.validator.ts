import { z } from "zod";
import { Status } from "@prisma/client";

export const IssueBodyValidator = z.object({
	title: z.string(),
	description: z.string(),
	status: z.enum(Object.values(Status)).optional(),
});

export type IssueBody = z.infer<typeof IssueBodyValidator>;
