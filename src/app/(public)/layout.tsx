"use client";

import React from "react";

type PublicLayoutProps = {
	children: React.ReactNode;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {
	return (
		<main className="flex h-full flex-1 items-center justify-center">
			{children}
		</main>
	);
};

export default PublicLayout;
