import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

type Params = {
	userId: string;
	commentId: string;
};
export async function hasAccessToCommentRequirement({ userId, commentId }: Params): Promise<void> {
	const comment = await prisma.comment.findFirst({
		where: {
			id: commentId,
			creator: {
				userId,
			},
		},
	});

	if (!comment) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Forbidden",
		});
	}
}
