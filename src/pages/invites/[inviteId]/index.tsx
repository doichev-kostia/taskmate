import React, { useEffect } from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/modal";
import { Button, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { api } from "~/utils/api";
import { z } from "zod";
import { useRouter } from "next/router";
import { CloseIcon } from "@chakra-ui/icons";
import { isBrowser } from "~/utils/isBrowser";

function AcceptInvitePage() {
	const router = useRouter();
	console.log({ query: router.query });
	const res = z
		.object({
			inviteId: z.string().uuid(),
		})
		.safeParse(router.query);

	const {
		mutate: acceptInvite,
		isLoading,
		isSuccess,
	} = api.invites.acceptInvite.useMutation();

	const searchParams = new URLSearchParams(
		isBrowser() ? window.location.search : ""
	);
	const success = isSuccess || searchParams.get("success") === "true";

	useEffect(() => {
		if (!res.success) return;

		acceptInvite(res.data.inviteId, {
			onError: (error) => {
				console.error(error);
			},
		});
	}, [res.success]);

	return (
		<PrivateLayout>
			<section>
				<Modal isOpen={true} onClose={() => undefined}>
					<ModalOverlay />
					<ModalContent height="300px">
						{isLoading ? (
							<div className="flex h-full flex-1 items-center justify-center">
								<Spinner
									thickness="4px"
									speed="0.65s"
									emptyColor="gray.200"
									color="blue.500"
									size="xl"
								/>
							</div>
						) : (
							<>
								<ModalHeader>
									{success
										? "Thank you for accepting the invite!"
										: "Unexpected error!"}
								</ModalHeader>
								<ModalBody className="text-center">
									{success ? (
										<p>
											You can go back to the dashboard and
											see the board there.
										</p>
									) : (
										<div className="flex h-full items-center justify-center">
											<CloseIcon
												color="red"
												className="h-[40px] w-[40px]"
											/>
										</div>
									)}
								</ModalBody>

								<ModalFooter className="flex items-center justify-center">
									<Button
										colorScheme="brand"
										as={Link}
										href="/dashboard"
									>
										My dashboard
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</section>
		</PrivateLayout>
	);
}

export default AcceptInvitePage;
