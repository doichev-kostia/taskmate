import { SignIn } from "@clerk/nextjs";
import { PublicLayout } from "~/layouts/PublicLayout";
import { isBrowser } from "~/utils/isBrowser";

function SignInPage() {
	const searchParams = new URLSearchParams(
		isBrowser() ? window.location.search : ""
	);
	const redirectUrl = searchParams.get("redirect_url") ?? "/";
	return (
		<PublicLayout>
			<SignIn signUpUrl="/sign-up" redirectUrl={redirectUrl} />
		</PublicLayout>
	);
}

export default SignInPage;
