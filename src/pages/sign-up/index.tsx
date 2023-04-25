import { SignUp } from "@clerk/nextjs";
import { PublicLayout } from "~/layouts/PublicLayout";
import { isBrowser } from "~/utils/isBrowser";

function SignUpPage() {
	const searchParams = new URLSearchParams(
		isBrowser() ? window.location.search : ""
	);
	const redirectUrl = searchParams.get("redirect_url") ?? "/";
	return (
		<PublicLayout>
			<SignUp signInUrl="/sign-in" redirectUrl={redirectUrl} />
		</PublicLayout>
	);
}

export default SignUpPage;
