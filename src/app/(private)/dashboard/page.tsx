"use client";

import React from "react";
import { useSignOut } from "~/hooks/useSignOut";

const DashboardPage = () => {
	const signOut = useSignOut();

	return (
		<div>
			<h1>Dashboard</h1>

			<button onClick={signOut}>Sign out</button>
		</div>
	);
};

export default DashboardPage;
