import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { MemberBodyValidator } from "~/contracts/member.body.validator";
import { TRPCError } from "@trpc/server";

export const memberRouter = createTRPCRouter({
	getMember: privateProcedure.input(MemberBodyValidator).query(async function getMember({ ctx, input }) {
		const { id, userId } = input;

		const member = await ctx.prisma.member.findFirst({
			where: {
				OR: [
					{
						id,
					},
					{
						userId,
						boardId: input.boardId,
					},
				],
			},
		});

		if (!member) {
			throw new TRPCError({
				code: "NOT_FOUND",
			});
		}

		return member;
	}),
});
