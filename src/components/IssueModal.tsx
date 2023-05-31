import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import {
	Avatar,
	Button,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	ModalCloseButton,
	Select,
	Spinner,
} from "@chakra-ui/react";
import { api } from "~/utils/api";
import { isBrowser } from "~/utils/isBrowser";
import React from "react";
import { Status } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IssueBodyValidator } from "~/contracts/issue.body.validator";
import { type z } from "zod";
import { Editor } from "~/components/Editor";
import { sanitize } from "~/utils/sanilize";
import { DeleteIcon } from "@chakra-ui/icons";
import { type MemberDetailedRepresentation } from "~/contracts/member.representation.validator";
import { IssueComments } from "~/components/IssueComments";
import { getFullName } from "~/utils/getFullName";
import { cx } from "~/styles/cx";

type Props = {
	isOpen: boolean;
	boardId: string;
	onClose: () => void;
};

type Values = Partial<Pick<z.infer<typeof IssueBodyValidator>, "title" | "description">>;

export function IssueModal({ isOpen, onClose, boardId }: Props) {
	const searchParams = isBrowser() ? new URLSearchParams(window.location.search) : new URLSearchParams();
	const issueId = searchParams.get("issue") ?? "";

	const {
		data: issue,
		isInitialLoading: isIssueLoading,
		isError: isIssueError,
	} = api.issues.getIssue.useQuery(
		{
			boardId,
			issueId,
		},
		{
			enabled: Boolean(isOpen && issueId && boardId),
		}
	);
	const { data: members } = api.boards.getMembers.useQuery(boardId, {
		enabled: Boolean(isOpen && boardId),
	});

	const memberMap = new Map<string, MemberDetailedRepresentation>();

	members?.forEach((member) => {
		memberMap.set(member.id, member);
	});

	const { mutateAsync: updateIssue, isLoading: isUpdatingIssue } = api.issues.update.useMutation();
	const { mutate: deleteIssue } = api.issues.deleteIssue.useMutation();
	const { mutateAsync: addAssignee, isLoading: isAddingAssignee } = api.issues.addAssignee.useMutation();
	const { mutateAsync: deleteAssignee, isLoading: isAssigneeDeleting } = api.issues.deleteAssignee.useMutation();

	const utils = api.useContext();

	const { register, control, handleSubmit, reset } = useForm<Values>({
		resolver: zodResolver(IssueBodyValidator.partial().pick({ title: true, description: true })),
		values: {
			title: issue?.title,
			description: sanitize(issue?.description ?? ""),
		},
	});

	const updateIssueStatus = async (status: Status) => {
		await updateIssue({
			boardId,
			issueId,
			issue: {
				status,
			},
		});
		await utils.boards.getBoard.invalidate({
			boardId,
		});
	};

	const onSubmit = handleSubmit(async function submitIssue(data) {
		await updateIssue({
			boardId,
			issueId,
			issue: {
				title: data.title,
				description: sanitize(data.description ?? ""),
			},
		});
		await utils.boards.getBoard.invalidate({
			boardId,
		});
		onClose();
		reset();
	});

	const unassignedMembers = members?.filter((member) => {
		return !issue?.assignees.some((assignee) => assignee.memberId === member.id);
	});

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent className="min-h-[300px]">
				{isIssueLoading ? (
					<div className="flex h-full flex-1 items-center justify-center">
						<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
					</div>
				) : isIssueError || !issueId ? (
					<>
						<ModalHeader className="text-slate-300">Issue not found</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<p className="text-slate-500">The issue you are looking for does not exist.</p>
						</ModalBody>
					</>
				) : (
					<>
						<ModalCloseButton />
						<ModalBody className="pt-12">
							<form onSubmit={onSubmit}>
								<FormControl isRequired className="mb-4">
									<FormLabel>Title </FormLabel>
									<Input
										placeholder="Title"
										className="placeholder:text-slate-500"
										{...register("title", {
											required: true,
										})}
										disabled={isUpdatingIssue}
									/>
								</FormControl>

								<div className="mb-5">
									<Controller
										name="description"
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<Editor
												data-color-mode="dark"
												value={field.value}
												onChange={(value) => {
													field.onChange(value);
												}}
												onBlur={field.onBlur}
											/>
										)}
									/>
								</div>

								<div className="flex justify-center">
									<Button type="submit" colorScheme="brand" isLoading={isUpdatingIssue}>
										Save
									</Button>
								</div>
							</form>
							<div>
								<FormControl isRequired className="mb-4">
									<FormLabel>Status </FormLabel>
									<Select
										defaultValue={issue?.status}
										onChange={({ target }) => {
											updateIssueStatus(target.value as Status);
										}}
										disabled={isUpdatingIssue}
									>
										<option value={Status.BACKLOG}>Backlog</option>
										<option value={Status.TO_DO}>Todo</option>
										<option value={Status.IN_PROGRESS}>In progress</option>
										<option value={Status.DONE}>Done</option>
										<option value={Status.CANCELLED}>Cancelled</option>
									</Select>
								</FormControl>
								<FormControl isRequired className="mb-4">
									<FormLabel>Assignees </FormLabel>
									<Select
										defaultValue="default"
										onChange={async ({ target }) => {
											await addAssignee({
												issueId,
												memberId: target.value,
											});
											await utils.issues.getIssue.invalidate({
												boardId,
												issueId,
											});
											target.value = "default";
										}}
										disabled={
											isUpdatingIssue || isAssigneeDeleting || isIssueLoading || isAddingAssignee
										}
									>
										<option value="default" disabled>
											Select assignee
										</option>
										{unassignedMembers?.map((member) => (
											<option key={member.id} value={member.id}>
												{getFullName(member?.firstName, member?.lastName)}
											</option>
										))}
									</Select>
								</FormControl>
								<ul className="mb-4">
									{issue?.assignees.map(({ id, memberId }) => {
										const member = memberMap.get(memberId);
										return (
											<li key={memberId} className="flex justify-between gap-x-3">
												<div className="flex gap-x-3">
													<Avatar
														size="xs"
														name={getFullName(member?.firstName, member?.lastName)}
														src={member?.profileImageUrl ?? undefined}
														title={getFullName(member?.firstName, member?.lastName)}
													/>
													<span className="block text-slate-300">
														{getFullName(member?.firstName, member?.lastName)}
													</span>
												</div>
												<IconButton
													aria-label="remove member"
													className={cx("text-red-600")}
													icon={<DeleteIcon />}
													isDisabled={isAssigneeDeleting}
													onClick={async () => {
														await deleteAssignee({
															issueId: issueId,
															assigneeId: id,
														});

														await utils.issues.getIssue.invalidate({
															boardId,
															issueId,
														});
													}}
												/>
											</li>
										);
									})}
								</ul>
								<div>
									<h4 className="mb-1">Actions</h4>
									<IconButton
										className="text-red-600"
										aria-label="Delete issue"
										icon={<DeleteIcon />}
										onClick={() => {
											deleteIssue({
												boardId,
												issueId,
											});
											void utils.boards.getBoard
												.invalidate({
													boardId,
												})
												.then(() => {
													onClose();
												});
										}}
									/>
								</div>
							</div>
							<IssueComments comments={issue?.comments ?? []} memberMap={memberMap} issueId={issueId} />
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
