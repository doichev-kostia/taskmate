import React, { useEffect, useState } from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type BoardBody, BoardBodyValidator } from "~/contracts/board.body.validator";
import { Avatar, Button, FormControl, FormLabel, IconButton, Input, Select } from "@chakra-ui/react";
import { BOARD_IMAGES } from "~/utils/constants";
import { cx } from "~/styles/cx";
import { createParamsParser } from "~/utils/createParamsParser";
import { DeleteIcon } from "@chakra-ui/icons";
import { type MemberRole } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { httpClient } from "~/http-client";
import { type UserRepresentation } from "~/contracts/user.representation.validator";
import { useTokenData } from "~/hooks/useTokenData";
import { type BoardDetailedRepresentation } from "~/contracts/board.representation.validator";
import { type MemberRepresentation } from "~/contracts/member.representation.validator";
import { type UpdateMemberBody } from "~/contracts/update-member.body.validator";
import { toast } from "react-toastify";

type Values = z.infer<typeof BoardBodyValidator>;

function BoardSettingsPage() {
	const router = useRouter();

	const { boardId } = createParamsParser(
		{
			boardId: z.coerce.number().optional(),
		},
		router.query
	);

	const { userId } = useTokenData();

	const { data: user } = useQuery({
		queryKey: ["user", userId],
		queryFn: () => httpClient.get<UserRepresentation>(`/users/${userId}`),
	});

	const { data: board, refetch } = useQuery({
		queryKey: ["boards", boardId],
		queryFn: () => httpClient.get<BoardDetailedRepresentation>(`/boards/${boardId as number}`),
		enabled: !!boardId,
	});

	const { data: member, isLoading: isMemberLoading } = useQuery({
		queryKey: ["boards", boardId, "members"],
		queryFn: () => {
			return httpClient.get<MemberRepresentation>("/members", {
				params: {
					boardId: boardId as number,
				},
			});
		},
		enabled: !!boardId,
	});

	const { mutateAsync: updateBoard, isLoading: isUpdating } = useMutation({
		mutationFn: ({ id, body }: { id: number; body: BoardBody }) => httpClient.put<void>(`/boards/${id}`, body),
	});

	const { mutateAsync: updateMember } = useMutation({
		mutationFn: ({ boardId, memberId, body }: { boardId: number; memberId: number; body: UpdateMemberBody }) =>
			httpClient.patch(`/boards/${boardId}/members/${memberId}`, body),
	});

	const { mutateAsync: removeBoard } = useMutation({
		mutationFn: ({ boardId }: { boardId: number }) => httpClient.delete(`/boards/${boardId}`),
	});

	const { mutateAsync: removeMember } = useMutation({
		mutationFn: ({ boardId, memberId }: { boardId: number; memberId: number }) =>
			httpClient.delete(`/boards/${boardId}/members/${memberId}`),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<Values>({
		resolver: zodResolver(BoardBodyValidator),
		defaultValues: {
			name: board?.name,
			imageUrl: board?.imageUrl,
		},
	});

	const hasEditRights = member?.role === "OWNER" || member?.role === "ADMIN";

	const onSubmit = handleSubmit(async (data) => {
		await updateBoard({
			id: boardId as number,
			body: data,
		});
	});

	const [chosenImage, setChosenImage] = useState<string | undefined>(board?.imageUrl);

	useEffect(() => {
		setChosenImage(board?.imageUrl);
	}, [board?.imageUrl]);

	const handleDelete = async () => {
		if (!boardId) {
			toast.error("Board not found");
			return;
		}
		if (member?.role === "OWNER") {
			await removeBoard({ boardId });
		} else {
			await removeMember({ boardId, memberId: member?.id as number });
		}

		await router.push("/dashboard");
	};

	const removeBoardMember = async (id: number) => {
		await removeMember({ boardId: boardId as number, memberId: id });
		await refetch();
	};

	const updateMemberRole = async (id: number, role: MemberRole) => {
		await updateMember({
			boardId: boardId as number,
			memberId: id,
			body: {
				role,
			},
		});
		await refetch();
	};

	return (
		<PrivateLayout>
			<section className="mx-auto max-w-screen-xl px-4 py-3">
				<div className="mb-4 flex items-center justify-between gap-5">
					<h1 className=" text-2xl text-white md:text-4xl">Board settings</h1>
					<Button isLoading={isMemberLoading} onClick={handleDelete} colorScheme="red">
						{member?.role === "OWNER" ? "Delete board" : "Leave board"}
					</Button>
				</div>

				<div className="mx-auto max-w-md">
					{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
					<form onSubmit={onSubmit}>
						<div className="mb-8">
							<FormControl isRequired className="mb-4">
								<FormLabel>Board name</FormLabel>
								<Input
									placeholder="Name"
									{...register("name", {
										required: true,
									})}
									disabled={!hasEditRights}
								/>
							</FormControl>
							<h3 className="mb-4">Choose the cover image*</h3>
							<div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
								{BOARD_IMAGES.map((url) => {
									const isActive = chosenImage === url;
									return (
										<div
											role="button"
											aria-label="board image"
											tabIndex={0}
											className={cx(
												"cursor-pointer overflow-hidden rounded-lg border-2 border-transparent bg-clip-padding outline-1 outline-slate-400",
												isActive ? " border-solid border-slate-400" : ""
											)}
											key={url}
											onClick={() => {
												if (!hasEditRights) return;
												setChosenImage(url);
												setValue("imageUrl", url);
											}}
										>
											<img src={url} alt="board image" className="bg-slate-400 object-contain" />
										</div>
									);
								})}
							</div>
							<p className="text-sm text-red-600">{errors.imageUrl && "Image is required"}</p>

							<div className="mb-5 flex justify-center">
								<Button
									type="submit"
									colorScheme="brand"
									isLoading={isUpdating}
									isDisabled={!hasEditRights}
								>
									Update
								</Button>
							</div>

							<h3 className="mb-4">Members</h3>

							<ul className="flex flex-col gap-y-4">
								{board?.members.map((member) => {
									const isEditable =
										hasEditRights && member.role !== "OWNER" && member.userId !== user?.id;

									return (
										<li key={member.id} className="flex justify-between gap-x-3">
											<div className="flex gap-x-3">
												<Avatar
													name={member.user.firstName ?? undefined}
													src={member.user.profileImageUrl ?? undefined}
												/>
												<div>
													<span className="block text-slate-300">
														{member.user.firstName} {member.user.lastName}
													</span>
												</div>
											</div>
											<div className="flex gap-x-1">
												<div>
													<Select
														onChange={(event) =>
															updateMemberRole(
																member.id,
																event.target.value as MemberRole
															)
														}
														defaultValue={member.role}
														disabled={!isEditable}
													>
														<option value="OWNER" disabled>
															Owner
														</option>
														<option value="MEMBER" selected>
															Member
														</option>
														<option value="ADMIN">Admin</option>
													</Select>
												</div>
												<IconButton
													aria-label="remove member"
													className={cx("text-red-600")}
													icon={<DeleteIcon />}
													isDisabled={!isEditable}
													onClick={() => {
														if (!isEditable) return;
														void removeBoardMember(member.id);
													}}
												/>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</form>
				</div>
			</section>
		</PrivateLayout>
	);
}

export default BoardSettingsPage;
