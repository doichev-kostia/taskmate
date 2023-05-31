import React from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Button, FormControl, FormLabel, Input, ModalCloseButton, Select } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type IssueBody, IssueBodyValidator } from "~/contracts/issue.body.validator";
import { type z } from "zod";

import { Status } from "@prisma/client";
import { Editor } from "~/components/Editor";
import { sanitize } from "~/utils/sanilize";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "~/http-client";

export type CreateIssueModalProps = {
	boardId: number;
	isOpen: boolean;
	onClose: () => void;
};

type Values = Omit<z.infer<typeof IssueBodyValidator>, "boardId">;

export function CreateIssueModal({ boardId, isOpen, onClose }: CreateIssueModalProps) {
	const { mutateAsync: createIssue, isLoading } = useMutation({
		mutationFn: ({ boardId, body }: { boardId: number; body: IssueBody }) =>
			httpClient.post(`/issues/boards/${boardId}`, body),
	});
	const queryClient = useQueryClient();

	const { register, control, handleSubmit, reset } = useForm<Values>({
		resolver: zodResolver(IssueBodyValidator),
		defaultValues: {
			status: Status.BACKLOG,
			description: "",
		},
	});

	const onSubmit = handleSubmit(async function submitIssue(data) {
		await createIssue({
			boardId,
			body: {
				title: data.title,
				description: sanitize(data.description),
				status: data.status,
			},
		});
		await queryClient.invalidateQueries(["boards", boardId]);
		onClose();
		reset();
	});

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent className="py-2">
				<ModalHeader className="text-slate-300">Create an issue</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<form onSubmit={onSubmit}>
						<FormControl isRequired className="mb-4">
							<Input
								placeholder="Title"
								className="placeholder:text-slate-500"
								{...register("title", {
									required: true,
								})}
								disabled={isLoading}
							/>
						</FormControl>

						<FormControl isRequired className="mb-4">
							<FormLabel>Status: </FormLabel>
							<Select {...register("status", { required: true })} disabled={isLoading}>
								<option value={Status.BACKLOG}>Backlog</option>
								<option value={Status.TO_DO}>Todo</option>
								<option value={Status.IN_PROGRESS}>In progress</option>
								<option value={Status.DONE}>Done</option>
							</Select>
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
							<Button type="submit" colorScheme="brand" isLoading={isLoading}>
								Create
							</Button>
						</div>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

export default CreateIssueModal;
