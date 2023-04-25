import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

type Params = {
	userId: string;
	boardId: string;
};
export const hasBoardEditRightsRequirement = async ({
	userId,
	boardId,
}: Params): Promise<void> => {
	const board = await prisma.board.findFirst({
		where: {
			id: boardId,
			members: {
				some: {
					userId,
					role: {
						in: ["ADMIN", "OWNER"],
					},
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
