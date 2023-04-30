import React from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";

type HeaderDropdownProps = {
	imageUrl: string;
	userId: string;
	fullName: string;
};

export const HeaderDropdown = ({ imageUrl, fullName }: HeaderDropdownProps) => {
	return (
		<Menu>
			{({ isOpen }) => (
				<>
					<MenuButton aria-label="Profile" aria-haspopup={true} aria-expanded={isOpen}>
						<img className="h-8 w-8 rounded-full" src={imageUrl} alt={`Avatar of ${fullName}`} />
					</MenuButton>
					<MenuList className="divide-y divide-slate-600 border-0 bg-slate-800 text-base shadow outline-0">
						<MenuItem as="div" className="block bg-slate-800 text-lg text-slate-300">
							{fullName}
						</MenuItem>
						<MenuItem className="bg-slate-800 py-2" as={Link} href="/dashboard">
							Dashboard
						</MenuItem>
						<MenuItem className="bg-slate-800" as={Link} href="/sign-out">
							Sign out
						</MenuItem>
					</MenuList>
				</>
			)}
		</Menu>
	);
};
