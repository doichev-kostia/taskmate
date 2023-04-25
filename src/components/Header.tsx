import React from "react";
import Link from "next/link";
import { HeaderDropdown } from "~/components/HeaderDropdown";
import { useUser } from "@clerk/nextjs";

const getFullName = (firstName?: string | null, lastName?: string | null) => {
	if (!firstName && lastName) {
		return `Mr or Ms ${lastName}`;
	}

	if (!lastName && firstName) {
		return firstName;
	}

	if (!firstName || !lastName) {
		return "Me";
	}

	return `${firstName} ${lastName}`;
};

export const Header = () => {
	const { user } = useUser();

	const fullName =
		user?.fullName ?? getFullName(user?.firstName, user?.lastName);

	return (
		<header className="border-b border-solid border-slate-600 ">
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
					{user && (
						<HeaderDropdown
							imageUrl={user.profileImageUrl}
							userId={user.id}
							fullName={fullName}
						/>
					)}
				</div>
			</nav>
		</header>
	);
};
