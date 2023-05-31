import { getFullName } from "~/utils/getFullName";
import { Avatar, Button, FormControl, IconButton, Input } from "@chakra-ui/react";
import React from "react";
import type { CommentRepresentation } from "~/contracts/comment.representation.validator";
import type { MemberDetailedRepresentation } from "~/contracts/member.representation.validator";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { type CommentBody, CommentBodyValidator } from "~/contracts/comment.body.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "~/http-client";
import { useTokenData } from "~/hooks/useTokenData";
import { type UserRepresentation } from "~/contracts/user.representation.validator";

type IssueCommentProps = {
	comments: CommentRepresentation[];
	memberMap: Map<number, MemberDetailedRepresentation>;
	issueId: string;
	boardId: number;
};

const CommentSchema = CommentBodyValidator.pick({
	content: true,
});

type Values = z.infer<typeof CommentSchema>;

export function IssueComments({ issueId, comments, memberMap, boardId }: IssueCommentProps) {
	const queryClient = useQueryClient();

	const { mutateAsync: addComment, isLoading: isCommentCreating } = useMutation({
		mutationFn: ({ issueId, body }: { issueId: number; body: CommentBody }) =>
			httpClient.post(`issues/${issueId}/comments`, body),
	});

	const { data: member, isLoading: isMemberLoading } = useQuery({
		queryKey: ["boards", boardId, "members"],
		queryFn: () => {
			return httpClient.get<MemberDetailedRepresentation>("/members", {
				params: {
					boardId,
				},
			});
		},
		enabled: !!boardId,
	});

	const { mutateAsync: deleteComment, isLoading: isCommentDeleting } = useMutation({
		mutationFn: ({ commentId }: { commentId: number }) => httpClient.delete(`issues/comments/${commentId}`),
	});

	const { register, handleSubmit, reset } = useForm<Values>({
		resolver: zodResolver(CommentSchema),
		defaultValues: {
			content: "",
		},
	});

	const { userId } = useTokenData();

	const { data: user } = useQuery({
		queryKey: ["user", userId],
		queryFn: () => httpClient.get<UserRepresentation>(`/users/${userId}`),
	});

	const isUpdating = isCommentCreating || isCommentDeleting;

	const onSubmit = handleSubmit(async function commentSubmitHandler(values) {
		await addComment({
			issueId: Number(issueId),
			body: {
				content: values.content,
				creatorId: member?.id as number,
			},
		});
		await queryClient.invalidateQueries(["board", boardId, "issues", issueId]);
		reset();
	});

	const onDelete = async (commentId: number, isOwner: boolean) => {
		if (!isOwner) {
			toast.error("You are not the owner of this comment");
			return;
		}
		await deleteComment({
			commentId,
		});
		await queryClient.invalidateQueries(["board", boardId, "issues", issueId]);
	};

	return (
		<div>
			<h4 className="mb-1">Comments</h4>
			<ul className="mb-6 flex flex-col gap-y-5">
				{comments.map((comment) => {
					const member = memberMap.get(comment.creator.id);
					const isOwner = member?.user.id === user?.id;
					const fullName = getFullName(member?.user?.firstName, member?.user?.lastName);

					return (
						<li key={comment.id}>
							<div className="flex justify-between gap-x-3">
								<div className="flex items-center gap-x-2">
									<Avatar
										size="sm"
										name={fullName}
										src={memberMap.get(comment.creator.id)?.user?.profileImageUrl ?? undefined}
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
						<Button type="submit" colorScheme="brand" isLoading={isUpdating || isMemberLoading}>
							Comment
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
