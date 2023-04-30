import React, { useState } from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { z } from "zod";
import Link from "next/link";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
	Avatar,
	AvatarGroup,
	Button,
	FormControl,
	FormLabel,
	IconButton,
	ModalCloseButton,
	Select,
	Spinner,
} from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { BoardColumn } from "~/components/BoardColumn";
import { createParamsParser } from "~/utils/createParamsParser";
import { type MemberRole } from "@prisma/client";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { toast } from "react-toastify";
import { getFullName } from "~/utils/getFullName";

const createInviteLink = (inviteId: string) => {
	return new URL(`/invites/${inviteId}`, window.location.origin).toString();
};

function BoardPage() {
	const router = useRouter();
	const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
	const [memberRole, setMemberRole] = useState<MemberRole>("MEMBER");
	const { boardId = "" } = createParamsParser(
		{
			boardId: z.string().uuid().optional(),
		},
		router.query
	);

	const { user } = useUser();

	const { data, isLoading, isError } = api.boards.getBoard.useQuery(boardId, {
		enabled: !!boardId,
	});
	const {
		mutateAsync: attachMember,
		isLoading: isAttaching,
		isSuccess: isAttached,
		data: invite,
	} = api.boards.attachMember.useMutation();

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			toast.success("Copied to clipboard");
		});
	};

	const addMember = async (role: MemberRole) => {
		await attachMember({
			boardId,
			invite: {
				role,
			},
		});
	};

	const members = data?.members ? data.members.filter((member) => member.userId !== user?.id) : [];

	return (
		<PrivateLayout>
			<Head>
				{isLoading ? <title>Taskmate | Board</title> : <title>Taskmate | Board | {data?.name ?? ""}</title>}
			</Head>
			<div className="mx-auto flex min-h-screen max-w-screen-xl flex-col px-4 py-3">
				{isLoading ? (
					<div className="mb-6">
						<div className="mb-3 h-5 animate-pulse rounded-lg bg-slate-600" />
					</div>
				) : isError ? (
					<div className="mb-6">Something went wrong. Please try again later.</div>
				) : (
					<div className="mb-6">
						<div className="mb-5 flex items-center justify-between">
							<h1 className="text-4xl text-white">{data.name}</h1>
							<Link href={`/boards/${boardId}/settings`}>
								<EditIcon />
							</Link>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex gap-x-5">
								<AvatarGroup size="sm" max={3}>
									<Avatar name={"Me"} src={user?.profileImageUrl} title={"Me"} />
									{members.map((member) => (
										<Avatar
											key={member.id}
											name={getFullName(member.firstName, member.lastName) ?? undefined}
											src={member?.profileImageUrl ?? undefined}
											title={getFullName(member.firstName, member.lastName) ?? undefined}
										/>
									))}
								</AvatarGroup>
								<IconButton
									onClick={() => setIsAddMemberModalOpen(true)}
									aria-label="add member"
									icon={<AddIcon />}
									colorScheme="brand"
									size="sm"
									className="rounded-full"
								/>
							</div>
							<Button colorScheme="brand" size="sm">
								Create issue
							</Button>
						</div>
					</div>
				)}

				{isLoading ? (
					<div>Loading...</div>
				) : isError ? (
					<div>Something went wrong. Please try again later.</div>
				) : (
					<section className="flex-1">
						<div className="flex h-full">
							<BoardColumn id="BACKLOG" name="Backlog" issues={[]} className="flex-1" />
							<BoardColumn id="TO_DO" name="Todo" issues={[]} className="flex-1" />
							<BoardColumn id="IN_PROGRESS" name="In progress" issues={[]} className="flex-1" />
							<BoardColumn id="DONE" name="Done" issues={[]} className="flex-1" />
						</div>
					</section>
				)}
				<Modal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)}>
					<ModalOverlay />
					<ModalContent height="300px">
						{isAttaching ? (
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
												<Select
													onChange={({ target }) => setMemberRole(target.value as MemberRole)}
												>
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
												addMember(memberRole);
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
			</div>
		</PrivateLayout>
	);
}

export default BoardPage;
