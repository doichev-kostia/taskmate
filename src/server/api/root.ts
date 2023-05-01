import { createTRPCRouter } from "~/server/api/trpc";
import { boardsRouter } from "~/server/api/routers/boards";
import { invitesRouter } from "~/server/api/routers/invites";
import { memberRouter } from "~/server/api/routers/members";
import { issuesRouter } from "~/server/api/routers/issues";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	boards: boardsRouter,
	invites: invitesRouter,
	members: memberRouter,
	issues: issuesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
