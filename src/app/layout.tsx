import React from "react";
import { ClerkProvider } from "@clerk/nextjs/app-beta";

type RootLayoutProps = {
	children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
		<head>
			<title>Next.js 13 with Clerk</title>
		</head>
		<ClerkProvider>
			<body>{children}</body>
		</ClerkProvider>
		</html>
	);
}

export default RootLayout;
