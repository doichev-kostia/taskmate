"use client";

import { type NextPage } from "next";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

const Home: NextPage = () => {
	const user = useUser();
	console.log({ user });

	return (
		<>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
					<h1> Sign in </h1>
					{!user.isSignedIn ? <SignInButton /> : <SignOutButton />}
				</div>
			</main>
		</>
	);
};

export default Home;
