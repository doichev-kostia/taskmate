import React from "react";
import { ClerkProvider } from "@clerk/nextjs/app-beta";
import "~/styles/globals.css";

type RootLayoutProps = {
	children: React.ReactNode;
};

function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<head>
				<title>Taskmate</title>
			</head>
			<ClerkProvider>
				<body className="bg-slate-900 text-gray-200">
					<div className="flex min-h-screen w-full flex-col">
						{children}
					</div>
				</body>
			</ClerkProvider>
		</html>
	);
}

export default RootLayout;
