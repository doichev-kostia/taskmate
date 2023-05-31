import { z } from "zod";
import { MemberDetailedRepresentationValidator } from "~/contracts/member.representation.validator";
import { IssueRepresentationValidator } from "~/contracts/issue.representation.validator";

export const BoardRepresentationValidator = z.object({
	id: z.number(),
	name: z.string(),
	imageUrl: z.string().url(),
});

export type BoardRepresentation = z.infer<typeof BoardRepresentationValidator>;

export const BoardDetailedRepresentationValidator = BoardRepresentationValidator.extend({
	members: z.array(MemberDetailedRepresentationValidator),
	issues: z.array(IssueRepresentationValidator),
});

export type BoardDetailedRepresentation = z.infer<typeof BoardDetailedRepresentationValidator>;
