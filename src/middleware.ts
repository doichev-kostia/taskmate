import { withClerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_KEY } from "~/utils/constants";

// Set the paths that don't require the user to be signed in
const publicPaths = ["/sign-in*"];
const isApi = (path: string) => path.startsWith("/api");

const isPublic = (path: string) => {
	return publicPaths.find((x) => path.match(new RegExp(`^${x}$`.replace("*$", "($|/)"))));
};

export default withClerkMiddleware((request: NextRequest) => {
	if (isPublic(request.nextUrl.pathname) || isApi(request.nextUrl.pathname)) {
		return NextResponse.next();
	}

	// if the user is not signed in redirect them to the sign in page.
	const token = request.cookies.get(ACCESS_TOKEN_KEY);

	if (!token) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("redirect_url", request.url);
		return NextResponse.redirect(signInUrl);
	}
	return NextResponse.next();
});

// Stop Middleware running on static files and public folder
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next
		 * - static (static files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 * - public folder
		 */
		"/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
		"/",
	],
};
