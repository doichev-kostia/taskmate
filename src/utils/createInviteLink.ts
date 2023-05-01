export const createInviteLink = (inviteId: string) => {
	return new URL(`/invites/${inviteId}`, window.location.origin).toString();
};
