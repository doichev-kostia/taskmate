import React from "react";
import Link from "next/link";
import { HeaderDropdown } from "~/components/HeaderDropdown";
import { getFullName } from "~/utils/getFullName";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "~/http-client";
import { type UserRepresentation } from "~/contracts/user.representation.validator";
import { useTokenData } from "~/hooks/useTokenData";

export const Header = () => {
	const { userId } = useTokenData();

	const { data: user } = useQuery({
		queryKey: ["user", userId],
		queryFn: () => httpClient.get<UserRepresentation>(`/users/${userId}`),
	});

	const fullName = getFullName(user?.firstName, user?.lastName);

	return (
		<header className="border-b border-solid border-slate-600 ">
			<nav className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
				<Link href="/" className="flex items-center">
					<img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8" alt="Taskmate Logo" />
					<span className="self-center whitespace-nowrap text-2xl font-semibold text-white">Taskmate</span>
				</Link>
				<div className="flex items-center md:order-2">
					{user && <HeaderDropdown imageUrl={user.profileImageUrl} userId={user.id} fullName={fullName} />}
				</div>
			</nav>
		</header>
	);
};
