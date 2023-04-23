import { SignIn } from "@clerk/nextjs";
import { PublicLayout } from "~/layouts/PublicLayout";

function SignInPage() {
	return (
		<PublicLayout>
			<SignIn signUpUrl="/sign-up" />
		</PublicLayout>
	);
}

export default SignInPage;
