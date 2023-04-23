import React from "react";

type PublicLayoutProps = {
	children: React.ReactNode;
};

export const PublicLayout = ({ children }: PublicLayoutProps) => {
	return (
		<main className="flex h-full flex-1 items-center justify-center">
			{children}
		</main>
	);
};
