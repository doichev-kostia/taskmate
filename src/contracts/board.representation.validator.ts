import { z } from "zod";
import { MemberDetailedRepresentationValidator } from "~/contracts/member.representation.validator";
import { IssueRepresentationValidator } from "~/contracts/issue.representation.validator";

export const BoardRepresentationValidator = z.object({
	id: z.string().uuid(),
	name: z.string(),
	imageUrl: z.string().url(),
});

export const BoardDetailedRepresentationValidator = BoardRepresentationValidator.extend({
	members: z.array(MemberDetailedRepresentationValidator),
	issues: z.array(IssueRepresentationValidator),
});
