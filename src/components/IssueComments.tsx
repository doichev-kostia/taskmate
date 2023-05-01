import { getFullName } from "~/utils/getFullName";
import { Avatar, Button, FormControl, IconButton, Input } from "@chakra-ui/react";
import React from "react";
import type { CommentRepresentation } from "~/contracts/comment.representation.validator";
import type { MemberDetailedRepresentation } from "~/contracts/member.representation.validator";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { CommentBodyValidator } from "~/contracts/comment.body.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { DeleteIcon } from "@chakra-ui/icons";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

type IssueCommentProps = {
	comments: CommentRepresentation[];
	memberMap: Map<string, MemberDetailedRepresentation>;
	issueId: string;
};

const CommentSchema = CommentBodyValidator.pick({
	content: true,
});

type Values = z.infer<typeof CommentSchema>;

export function IssueComments({ issueId, comments, memberMap }: IssueCommentProps) {
	const utils = api.useContext();
	const { mutateAsync: addComment, isLoading: isCommentCreating } = api.issues.addComment.useMutation();
	const { mutateAsync: deleteComment, isLoading: isCommentDeleting } = api.issues.deleteComment.useMutation();

	const { register, handleSubmit, reset } = useForm<Values>({
		resolver: zodResolver(CommentSchema),
		defaultValues: {
			content: "",
		},
	});
	const { user } = useUser();

	const isUpdating = isCommentCreating || isCommentDeleting;

	const onSubmit = handleSubmit(async function commentSubmitHandler(values) {
		await addComment({
			issueId,
			content: values.content,
		});
		await utils.issues.getIssue.invalidate({ issueId });
		reset();
	});

	const onDelete = async (commentId: string, isOwner: boolean) => {
		if (!isOwner) {
			toast.error("You are not the owner of this comment");
			return;
		}
		await deleteComment({
			commentId,
		});
		await utils.issues.getIssue.invalidate({ issueId });
	};

	return (
		<div>
			<h4 className="mb-1">Comments</h4>
			<ul className="mb-6 flex flex-col gap-y-5">
				{comments.map((comment) => {
					const member = memberMap.get(comment.creatorId);
					const isOwner = member?.userId === user?.id;
					const fullName = getFullName(member?.firstName, member?.lastName);

					return (
						<li key={comment.id}>
							<div className="flex justify-between gap-x-3">
								<div className="flex items-center gap-x-2">
									<Avatar
										size="sm"
										name={fullName}
										src={memberMap.get(comment.creatorId)?.profileImageUrl ?? undefined}
									/>
									<div>
										<div className="mb-1 flex items-center">
											<span className="text-slate-300">{fullName}</span>
											<span className="ml-2 text-slate-500">
												{comment.createdAt.toLocaleString()}
											</span>
										</div>
										<div>
											<p>{comment.content}</p>
										</div>
									</div>
								</div>
								<div>
									<IconButton
										isDisabled={!isOwner}
										className="text-red-600"
										aria-label="Delete"
										icon={<DeleteIcon />}
										onClick={() => onDelete(comment.id, isOwner)}
									/>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
			<div>
				<form onSubmit={onSubmit}>
					<FormControl className="mb-4">
						<Input
							placeholder="Write a comment"
							className="placeholder:text-slate-500"
							{...register("content")}
							disabled={isUpdating}
						/>
					</FormControl>
					<div className="flex justify-center">
						<Button type="submit" colorScheme="brand" isLoading={isUpdating}>
							Comment
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
