import { useRouter } from "next/router";
import CookieService from "~/cookie-service";

export const useSignOut = () => {
	const router = useRouter();

	async function signOut() {
		await router.push("/sign-in");
		CookieService.remove("access_token", { path: "/" });
	}

	return signOut;
};
