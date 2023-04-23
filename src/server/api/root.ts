import { createTRPCRouter } from "~/server/api/trpc";
import { boardsRouter } from "~/server/api/routers/boards";
import { invitesRouter } from "~/server/api/routers/invites";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	boards: boardsRouter,
	invites: invitesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
