import React from "react";

export type BaseLayoutProps = {
	children: React.ReactNode;
};
export function BaseLayout({ children }: BaseLayoutProps) {
	return <div className="flex min-h-screen w-full flex-col">{children}</div>;
}
