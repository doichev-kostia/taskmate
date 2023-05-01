import React, { useState } from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { z } from "zod";
import Link from "next/link";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Avatar, AvatarGroup, Button, IconButton } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { BoardColumn } from "~/components/BoardColumn";
import { createParamsParser } from "~/utils/createParamsParser";
import { getFullName } from "~/utils/getFullName";
import { AttachMemberModal } from "~/components/AttachMemberModal";
import CreateIssueModal from "~/components/CreateIssueModal";
import type { Status } from "@prisma/client";
import { type IssueRepresentation } from "~/contracts/issue.representation.validator";
import { IssueModal } from "~/components/IssueModal";

function BoardPage() {
	const router = useRouter();
	const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
	const [isIssueCreationModalOpen, setIsIssueCreationModalOpen] = useState(false);
	const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

	const { boardId = "" } = createParamsParser(
		{
			boardId: z.string().uuid().optional(),
		},
		router.query
	);

	const { user } = useUser();

	const { data, isLoading, isError } = api.boards.getBoard.useQuery(
		{ boardId },
		{
			enabled: !!boardId,
		}
	);

	const members = data?.members ? data.members.filter((member) => member.userId !== user?.id) : [];

	const issues = new Map<Status, IssueRepresentation[]>();

	data?.issues.forEach((issue) => {
		const status = issue.status;
		const existing = issues.get(status);
		if (existing) {
			existing.push(issue);
		} else {
			issues.set(status, [issue]);
		}
	});

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
							<Button colorScheme="brand" size="sm" onClick={() => setIsIssueCreationModalOpen(true)}>
								Create issue
							</Button>
						</div>
					</div>
				)}

				<section className="flex h-px flex-1 flex-col">
					<div className="flex h-full flex-1 overflow-x-auto">
						{isLoading ? (
							<div>Loading...</div>
						) : isError ? (
							<div>Something went wrong. Please try again later.</div>
						) : (
							<>
								<BoardColumn
									id="BACKLOG"
									name="Backlog"
									issues={issues.get("BACKLOG") ?? []}
									className="flex-1"
									openModal={() => setIsIssueModalOpen(true)}
								/>
								<BoardColumn
									id="TO_DO"
									name="Todo"
									issues={issues.get("TO_DO") ?? []}
									className="flex-1"
									openModal={() => setIsIssueModalOpen(true)}
								/>
								<BoardColumn
									id="IN_PROGRESS"
									name="In progress"
									issues={issues.get("IN_PROGRESS") ?? []}
									className="flex-1"
									openModal={() => setIsIssueModalOpen(true)}
								/>
								<BoardColumn
									id="DONE"
									name="Done"
									issues={issues.get("DONE") ?? []}
									className="flex-1"
									openModal={() => setIsIssueModalOpen(true)}
								/>
							</>
						)}
					</div>
				</section>
				<AttachMemberModal
					boardId={boardId}
					isOpen={isAddMemberModalOpen}
					onClose={() => setIsAddMemberModalOpen(false)}
				/>
				<CreateIssueModal
					boardId={boardId}
					isOpen={isIssueCreationModalOpen}
					onClose={() => setIsIssueCreationModalOpen(false)}
				/>
				<IssueModal
					isOpen={isIssueModalOpen}
					boardId={boardId}
					onClose={() => {
						setIsIssueModalOpen(false);
						const url = new URL(window.location.href);
						url.searchParams.delete("issue");
						void router.replace(url.toString());
					}}
				/>
			</div>
		</PrivateLayout>
	);
}

export default BoardPage;
