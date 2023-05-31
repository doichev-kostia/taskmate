import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Button, FormControl, FormLabel, ModalCloseButton, Select, Spinner } from "@chakra-ui/react";
import type { MemberRole } from "@prisma/client";
import React, { useState } from "react";
import { createInviteLink } from "~/utils/createInviteLink";
import { copyToClipboard } from "~/utils/copyToClipboard";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "~/http-client";
import { type InviteBody } from "~/contracts/invite.body.validator";

type AddMemberModalProps = {
	isOpen: boolean;
	onClose: () => void;
	boardId: number;
};

export function AttachMemberModal({ isOpen, onClose, boardId }: AddMemberModalProps) {
	const {
		mutateAsync: attachMember,
		isLoading: isAttaching,
		isSuccess: isAttached,
		data: invite,
	} = useMutation({
		mutationFn: ({ boardId, body }: { boardId: number; body: InviteBody }) =>
			httpClient.post<{ id: string }>(`/invites/boards/${boardId}`, body),
	});

	const addMember = async (role: MemberRole) => {
		await attachMember({
			boardId,
			body: {
				memberRole: role,
			},
		});
	};
	const [memberRole, setMemberRole] = useState<MemberRole>("MEMBER");

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent height="300px">
				{isAttaching ? (
					<div className="flex h-full flex-1 items-center justify-center">
						<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
					</div>
				) : (
					<>
						<ModalHeader>{isAttached ? "Success!" : "Send an invite"}</ModalHeader>
						<ModalCloseButton />
						<ModalBody className="text-center">
							{isAttached ? (
								<>
									<p>Your invite link is</p>
									<span className="block">{createInviteLink(invite.id)}</span>
								</>
							) : (
								<div>
									<FormControl>
										<FormLabel>Select role</FormLabel>
										<Select onChange={({ target }) => setMemberRole(target.value as MemberRole)}>
											<option value="MEMBER" selected>
												Member
											</option>
											<option value="ADMIN">Admin</option>
										</Select>
									</FormControl>
								</div>
							)}
						</ModalBody>

						<ModalFooter className="flex items-center justify-center">
							<Button
								colorScheme="brand"
								onClick={() => {
									if (isAttached) {
										copyToClipboard(createInviteLink(invite.id));
									} else {
										void addMember(memberRole);
									}
								}}
							>
								{isAttached ? "Copy" : "Send"}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
