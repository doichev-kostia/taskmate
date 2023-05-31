import React, { useEffect } from "react";
import { PublicLayout } from "~/layouts/PublicLayout";
import { isBrowser } from "~/utils/isBrowser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { httpClient } from "~/http-client";
import { useRouter } from "next/router";
import { Button, Container, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { milliseconds, REDIRECT_KEY } from "~/utils/constants";

function SignInPage() {
	const searchParams = new URLSearchParams(isBrowser() ? window.location.search : "");
	const router = useRouter();
	const redirectUrl = searchParams.get("redirect_url");
	const code = searchParams.get("code");

	const { data: auth, isSuccess } = useQuery({
		queryKey: ["authentication", "url"],
		queryFn: () => httpClient.get<{ url: string }>("/auth/url"),
		enabled: !code,
		staleTime: 3 * milliseconds.second,
	});

	const { mutate: authenticate } = useMutation({
		mutationKey: ["authentication", "code"],
		mutationFn: ({ code }: { code: string }) => httpClient.post<{ token: string }>("/auth/oauth", { code }),
	});

	useEffect(() => {
		if (!redirectUrl) return;
		localStorage.setItem(REDIRECT_KEY, redirectUrl);
	}, [redirectUrl]);

	useEffect(() => {
		if (!code) return;
		authenticate(
			{ code },
			{
				onSettled: () => {
					const url = new URL(window.location.href);
					url.searchParams.delete("code");
					url.searchParams.delete("scope");
					url.searchParams.delete("authuser");
					url.searchParams.delete("hd");
					url.searchParams.delete("prompt");
					url.searchParams.delete("session_state");
					void router.replace(url.toString());
				},
				onSuccess: () => {
					const storedURL = localStorage.getItem(REDIRECT_KEY);
					let redirect;
					try {
						redirect = new URL(storedURL ?? "/").pathname;
					} catch (error) {
						redirect = "/";
					}
					void router.replace(redirect);
				},
			}
		);
	}, [code]);

	return (
		<PublicLayout>
			<Container className="flex justify-center">
				<div className="max-w-xs rounded-xl bg-slate-100 p-4">
					<Text as="h2" fontSize="2xl" className="mb-8">
						Sign in
					</Text>
					<Button as="a" isLoading={!isSuccess} href={auth?.url} variant={"outline"} leftIcon={<FcGoogle />}>
						Sign in with google
					</Button>
				</div>
			</Container>
		</PublicLayout>
	);
}

export default SignInPage;
