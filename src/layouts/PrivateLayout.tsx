import React from "react";
import { Header } from "~/components/Header";

export type PrivateLayoutProps = {
	children: React.ReactNode;
};
export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
};
