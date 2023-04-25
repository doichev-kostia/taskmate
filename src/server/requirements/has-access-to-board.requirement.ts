import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

type Params = {
	userId: string;
	boardId: string;
};
export const hasAccessToBoardRequirement = async ({
	userId,
	boardId,
}: Params): Promise<void> => {
	const board = await prisma.board.findFirst({
		where: {
			id: boardId,
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
};
