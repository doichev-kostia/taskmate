"use client";

import React from "react";
import Link from "next/link";

type HeaderDropdownProps = {
	imageUrl: string;
	userId: string;
	fullName: string;
	email: string;
};

export const HeaderDropdown = ({
	imageUrl,
	userId,
	fullName,
	email,
}: HeaderDropdownProps) => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<>
			<button
				className="mr-3 flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-0"
				aria-label="Profile"
				id="user-menu-button"
				aria-haspopup={true}
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
			>
				<span className="sr-only">Open user menu</span>
				<img
					className="h-8 w-8 rounded-full"
					src={imageUrl}
					alt={`Avatar of ${fullName}`}
				/>
			</button>
			<div
				className="z-50 my-4 hidden list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
				id="user-dropdown"
			>
				<div className="px-4 py-3">
					<span className="block text-sm text-gray-900 dark:text-white">
						{fullName}
					</span>
					<span className="block truncate  text-sm text-gray-500 dark:text-gray-400">
						{email}
					</span>
				</div>
				<ul className="py-2" aria-labelledby="user-menu-button">
					<li>
						<Link
							href="/dashboard"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Dashboard
						</Link>
					</li>
					<li>
						<Link
							href={`/users/${userId}`}
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Profile
						</Link>
					</li>
					<li>
						<Link
							href="/sign-out"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Sign out
						</Link>
					</li>
				</ul>
			</div>
		</>
	);
};
