import React, { useEffect, useState } from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import { useRouter } from "next/router";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoardBodyValidator } from "~/contracts/board.body.validator";
import { Avatar, Button, FormControl, FormLabel, IconButton, Input, Select } from "@chakra-ui/react";
import { BOARD_IMAGES } from "~/utils/constants";
import { cx } from "~/styles/cx";
import { createParamsParser } from "~/utils/createParamsParser";
import { DeleteIcon } from "@chakra-ui/icons";
import { type MemberRole } from "@prisma/client";

type Values = Partial<z.infer<typeof BoardBodyValidator>>;

function BoardSettingsPage() {
	const router = useRouter();

	const { boardId = "" } = createParamsParser(
		{
			boardId: z.string().uuid().optional(),
		},
		router.query
	);

	const { user } = useUser();

	const { data: board, refetch } = api.boards.getBoard.useQuery(
		{ boardId },
		{
			enabled: !!boardId,
		}
	);

	const { data: member, isLoading: isMemberLoading } = api.members.getMember.useQuery(
		{
			userId: user?.id,
			boardId,
		},
		{
			enabled: !!user?.id,
		}
	);

	const { mutateAsync: updateBoard, isLoading: isUpdating } = api.boards.updateBoard.useMutation();
	const { mutateAsync: updateMember } = api.boards.updateMember.useMutation();

	const { mutateAsync: removeBoard } = api.boards.removeBoard.useMutation();
	const { mutateAsync: removeMember } = api.boards.removeMember.useMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<Values>({
		resolver: zodResolver(BoardBodyValidator.partial()),
		values: {
			name: board?.name,
			imageUrl: board?.imageUrl,
		},
	});

	const hasEditRights = member?.role === "OWNER" || member?.role === "ADMIN";

	const onSubmit = handleSubmit(async (data) => {
		await updateBoard({
			id: boardId,
			board: data,
		});
	});

	const [chosenImage, setChosenImage] = useState<string | undefined>(board?.imageUrl);

	useEffect(() => {
		setChosenImage(board?.imageUrl);
	}, [board?.imageUrl]);

	const handleDelete = async () => {
		if (member?.role === "OWNER") {
			await removeBoard(boardId ?? "");
		} else {
			await removeMember(boardId);
		}

		await router.push("/dashboard");
	};

	const removeBoardMember = async (id: string) => {
		await removeMember(id);
		await refetch();
	};

	const updateMemberRole = async (id: string, role: MemberRole) => {
		await updateMember({
			boardId,
			memberId: id,
			role,
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
													name={member.firstName ?? undefined}
													src={member.profileImageUrl ?? undefined}
												/>
												<div>
													<span className="block text-slate-300">
														{member.firstName} {member.lastName}
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
