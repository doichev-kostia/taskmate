import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const useSignOut = () => {
	const auth = useAuth();
	const router = useRouter();

	async function signOut() {
		router.push("/sign-in");
		await auth.signOut();
	}

	return signOut;
};
