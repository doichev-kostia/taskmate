import { z } from "zod";
import { InviteBodyValidator } from "~/contracts/invite.body.validator";

export const AttachMemberBodyValidator = z.object({
	boardId: z.string(),
	invite: InviteBodyValidator,
});
