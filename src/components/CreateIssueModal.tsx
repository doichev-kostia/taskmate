import React from "react";
import { api } from "~/utils/api";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Button, FormControl, FormLabel, Input, ModalCloseButton, Select } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IssueBodyValidator } from "~/contracts/issue.body.validator";
import { type z } from "zod";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Status } from "@prisma/client";
import DOMPurify from "dompurify";

export type CreateIssueModalProps = {
	boardId: string;
	isOpen: boolean;
	onClose: () => void;
};

type Values = Omit<z.infer<typeof IssueBodyValidator>, "boardId">;

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function CreateIssueModal({ boardId, isOpen, onClose }: CreateIssueModalProps) {
	const { mutateAsync: createIssue, isLoading } = api.issues.create.useMutation();
	const utils = api.useContext();

	const { register, control, handleSubmit, reset } = useForm<Values>({
		resolver: zodResolver(IssueBodyValidator.omit({ boardId: true })),
		defaultValues: {
			status: Status.BACKLOG,
			description: "",
		},
	});

	const onSubmit = handleSubmit(async function submitIssue(data) {
		await createIssue({
			boardId,
			title: data.title,
			description: DOMPurify.sanitize(data.description),
			status: data.status,
		});
		await utils.boards.getBoard.invalidate({
			boardId,
		});
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
									<MDEditor
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
