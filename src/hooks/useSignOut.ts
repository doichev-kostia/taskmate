import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

export const useSignOut = () => {
	const auth = useAuth();
	const router = useRouter();

	async function signOut() {
		await router.push("/sign-in");
		await auth.signOut();
	}

	return signOut;
};
