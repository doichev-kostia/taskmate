import { SignUp } from "@clerk/nextjs";
import { PublicLayout } from "~/layouts/PublicLayout";

function SignUpPage() {
	return (
		<PublicLayout>
			<SignUp signInUrl="/sign-in" />
		</PublicLayout>
	);
}

export default SignUpPage;
