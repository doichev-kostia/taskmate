import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { MemberBodyValidator } from "~/contracts/member.body.validator";
import { TRPCError } from "@trpc/server";
import { MemberRepresentationValidator } from "~/contracts/member.representation.validator";

export const memberRouter = createTRPCRouter({
	getMember: privateProcedure
		.input(MemberBodyValidator)
		.output(MemberRepresentationValidator)
		.query(async function getMember({ ctx, input }) {
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
