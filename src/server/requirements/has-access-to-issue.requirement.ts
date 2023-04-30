import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

type Params = {
	userId: string;
	issueId: string;
};

export async function hasAccessToIssueRequirement({ userId, issueId }: Params): Promise<void> {
	const board = await prisma.board.findFirst({
		where: {
			issues: {
				some: {
					id: issueId,
				},
			},
			members: {
				some: {
					userId,
				},
			},
		},
	});

	if (!board) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Forbidden",
		});
	}
}
