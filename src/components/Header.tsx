"use client";

import React from "react";
import Link from "next/link";
import { HeaderDropdown } from "~/components/HeaderDropdown";

export const Header = () => {
	const user = {
		id: "123",
	};

	const fullName = "John Doe";

	return (
		<header>
			<nav className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
				<Link href="/" className="flex items-center">
					<img
						src="https://flowbite.com/docs/images/logo.svg"
						className="mr-3 h-8"
						alt="Taskmate Logo"
					/>
					<span className="self-center whitespace-nowrap text-2xl font-semibold text-white">
						Taskmate
					</span>
				</Link>
				<div className="flex items-center md:order-2">
					<HeaderDropdown
						imageUrl="https://picsum.photos/seed/picsum/200/300"
						userId={user.id}
						fullName={fullName}
					/>
				</div>
			</nav>
		</header>
	);
};
