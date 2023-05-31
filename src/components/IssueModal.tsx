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
import { isBrowser } from "~/utils/isBrowser";
import React from "react";
import { Status } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type IssueBody, IssueBodyValidator } from "~/contracts/issue.body.validator";
import { type z } from "zod";
import { Editor } from "~/components/Editor";
import { sanitize } from "~/utils/sanilize";
import { DeleteIcon } from "@chakra-ui/icons";
import { type MemberDetailedRepresentation } from "~/contracts/member.representation.validator";
import { IssueComments } from "~/components/IssueComments";
import { getFullName } from "~/utils/getFullName";
import { cx } from "~/styles/cx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "~/http-client";
import { type IssueDetailedRepresentation } from "~/contracts/issue.representation.validator";
import { type AssigneeBody } from "~/contracts/assignee.body.validator";

type Props = {
	isOpen: boolean;
	boardId: number;
	onClose: () => void;
};

type Values = Pick<z.infer<typeof IssueBodyValidator>, "title" | "description">;

export function IssueModal({ isOpen, onClose, boardId }: Props) {
	const searchParams = isBrowser() ? new URLSearchParams(window.location.search) : new URLSearchParams();
	const issueId = searchParams.get("issue") ?? "";

	const {
		data: issue,
		isInitialLoading: isIssueLoading,
		isError: isIssueError,
	} = useQuery({
		queryKey: ["board", boardId, "issues", issueId],
		queryFn: () => httpClient.get<IssueDetailedRepresentation>(`issues/${issueId}`),
		enabled: Boolean(issueId && isOpen),
	});

	const { data: members } = useQuery({
		queryKey: ["board", boardId, "members"],
		queryFn: () => httpClient.get<MemberDetailedRepresentation[]>(`boards/${boardId}/members`),
		enabled: Boolean(boardId),
	});

	const memberMap = new Map<number, MemberDetailedRepresentation>();

	members?.forEach((member) => {
		memberMap.set(member.id, member);
	});

	const { mutateAsync: updateIssueStatus, isLoading: isUpdatingIssueStatus } = useMutation({
		mutationFn: ({ issueId, body }: { issueId: number; body: Pick<IssueBody, "status"> }) =>
			httpClient.patch(`/issues/${issueId}/status`, body),
	});

	const { mutateAsync: updateIssue, isLoading: isUpdatingIssue } = useMutation({
		mutationFn: ({ issueId, body }: { issueId: number; body: IssueBody }) =>
			httpClient.put(`/issues/${issueId}`, body),
	});

	const { mutate: deleteIssue } = useMutation({
		mutationFn: ({ issueId }: { issueId: number }) => httpClient.delete(`/issues/${issueId}`),
	});

	const { mutateAsync: addAssignee, isLoading: isAddingAssignee } = useMutation({
		mutationFn: ({ issueId, body }: { issueId: number; body: AssigneeBody }) =>
			httpClient.post(`/issues/${issueId}/assignees`, body),
	});

	const { mutateAsync: deleteAssignee, isLoading: isAssigneeDeleting } = useMutation({
		mutationFn: ({ assigneeId }: { assigneeId: number }) => httpClient.delete(`/issues/assignees/${assigneeId}`),
	});

	const queryClient = useQueryClient();

	const { register, control, handleSubmit, reset } = useForm<Values>({
		resolver: zodResolver(IssueBodyValidator.partial().pick({ title: true, description: true })),
		values: {
			title: issue?.title ?? "",
			description: sanitize(issue?.description ?? ""),
		},
	});

	const editIssueStatus = async (status: Status) => {
		await updateIssueStatus({
			issueId: Number(issueId),
			body: {
				status: status,
			},
		});

		await queryClient.invalidateQueries(["boards", boardId]);
	};

	const onSubmit = handleSubmit(async function submitIssue(data) {
		await updateIssue({
			issueId: Number(issueId),
			body: {
				title: data.title,
				description: sanitize(data.description ?? ""),
				status: "BACKLOG",
			},
		});

		await queryClient.invalidateQueries(["boards", boardId]);
		onClose();
		reset();
	});

	const unassignedMembers = members?.filter((member) => {
		return !issue?.assignees.some((assignee) => assignee.member.id === member.id);
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
											void editIssueStatus(target.value as Status);
										}}
										disabled={isUpdatingIssue || isUpdatingIssueStatus}
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
											debugger;
											await addAssignee({
												issueId: Number(issueId),
												body: {
													memberId: Number(target.value),
												},
											});

											await queryClient.invalidateQueries(["board", boardId, "issues", issueId]);
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
												{getFullName(member?.user.firstName, member?.user.lastName)}
											</option>
										))}
									</Select>
								</FormControl>
								<ul className="mb-4">
									{issue?.assignees.map(({ id, member: { id: memberId } }) => {
										const member = memberMap.get(memberId);
										return (
											<li key={memberId} className="flex justify-between gap-x-3">
												<div className="flex gap-x-3">
													<Avatar
														size="xs"
														name={getFullName(
															member?.user.firstName,
															member?.user.lastName
														)}
														src={member?.user.profileImageUrl ?? undefined}
														title={getFullName(
															member?.user.firstName,
															member?.user.lastName
														)}
													/>
													<span className="block text-slate-300">
														{getFullName(member?.user?.firstName, member?.user?.lastName)}
													</span>
												</div>
												<IconButton
													aria-label="remove member"
													className={cx("text-red-600")}
													icon={<DeleteIcon />}
													isDisabled={isAssigneeDeleting}
													onClick={async () => {
														await deleteAssignee({
															assigneeId: id,
														});

														await queryClient.invalidateQueries([
															"board",
															boardId,
															"issues",
															issueId,
														]);
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
												issueId: Number(issueId),
											});
											void queryClient.invalidateQueries(["board", boardId]).then(() => {
												onClose();
											});
										}}
									/>
								</div>
							</div>
							<IssueComments
								comments={issue?.comments ?? []}
								memberMap={memberMap}
								issueId={issueId}
								boardId={boardId}
							/>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
