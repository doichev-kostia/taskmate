import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const invitesRouter = createTRPCRouter({
	acceptInvite: privateProcedure
		.input(z.string().uuid())
		.mutation(async function acceptInvite({ ctx, input }) {
			const invite = await ctx.prisma.invite.findUnique({
				where: {
					id: input,
				},
			});

			if (!invite) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Invite not found",
				});
			}

			const board = await ctx.prisma.board.findUnique({
				where: {
					id: invite.boardId,
				},
			});

			if (!board) {
				await ctx.prisma.invite.delete({
					where: {
						id: invite.id,
					},
				});

				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Board not found",
				});
			}

			await ctx.prisma.member.create({
				data: {
					boardId: board.id,
					userId: ctx.auth.userId,
					role: invite.role,
				},
			});

			await ctx.prisma.invite.delete({
				where: {
					id: invite.id,
				},
			});
		}),
});
