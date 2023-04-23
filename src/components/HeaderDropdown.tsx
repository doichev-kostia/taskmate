import React from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";

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
	return (
		<Menu>
			{({ isOpen }) => (
				<>
					<MenuButton
						aria-label="Profile"
						aria-haspopup={true}
						aria-expanded={isOpen}
					>
						<img
							className="h-8 w-8 rounded-full"
							src={imageUrl}
							alt={`Avatar of ${fullName}`}
						/>
					</MenuButton>
					<MenuList className="divide-y divide-gray-100 border-0 bg-slate-700 text-base shadow outline-0">
						<MenuItem
							as="div"
							className="block border-b border-solid bg-slate-700"
						>
							<span className="mb-2 block">{fullName}</span>
							<span className="block text-gray-400">{email}</span>
						</MenuItem>
						<MenuItem
							className="bg-slate-700 py-2"
							as={Link}
							href="/dashboard"
						>
							Dashboard
						</MenuItem>
						<MenuItem
							className="bg-slate-700"
							as={Link}
							href={`/users/${userId}`}
						>
							Profile
						</MenuItem>
						<MenuItem
							className="bg-slate-700"
							as={Link}
							href="/sign-out"
						>
							Sign out
						</MenuItem>
					</MenuList>
				</>
			)}
		</Menu>
	);
};
