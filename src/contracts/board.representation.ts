import { z } from "zod";
import { MemberDetailedRepresentation } from "~/contracts/member.representation";
import { IssueRepresentation } from "~/contracts/issue.representation";

export const BoardRepresentation = z.object({
	id: z.string().uuid(),
	name: z.string(),
	imageUrl: z.string().url(),
});

export const BoardDetailedRepresentation = BoardRepresentation.extend({
	members: z.array(MemberDetailedRepresentation),
	issues: z.array(IssueRepresentation),
});
