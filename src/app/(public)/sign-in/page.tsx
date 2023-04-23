import { SignIn } from "@clerk/nextjs/app-beta";

function SignInPage() {
	return <SignIn signUpUrl="/sign-up" />;
}

export default SignInPage;
