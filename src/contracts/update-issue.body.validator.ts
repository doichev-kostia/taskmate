import { z } from "zod";
import { IssueBodyValidator } from "~/contracts/issue.body.validator";

export const UpdateIssueBodyValidator = z.object({
	issueId: z.string().uuid(),
	boardId: z.string().uuid(),
	issue: IssueBodyValidator.omit({ boardId: true }).partial(),
});
