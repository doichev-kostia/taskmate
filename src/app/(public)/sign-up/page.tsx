import { SignUp } from "@clerk/nextjs/app-beta";

function SignUpPage() {
	return <SignUp signInUrl="/sign-in" />;
}

export default SignUpPage;
