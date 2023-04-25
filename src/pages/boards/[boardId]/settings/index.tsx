import React, { useState } from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import { useRouter } from "next/router";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoardBodyValidator } from "~/contracts/board.body.validator";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BOARD_IMAGES } from "~/utils/constants";
import { cx } from "~/styles/cx";
import { isBrowser } from "~/utils/isBrowser";
import { createParamsParser } from "~/utils/createParamsParser";

type Values = Partial<z.infer<typeof BoardBodyValidator>>;

function BoardSettingsPage() {
	const router = useRouter();
	const browser = isBrowser();

	const { boardId } = createParamsParser(
		{
			boardId: z.string().uuid(),
		},
		router.query
	);

	const { user } = useUser();

	const {
		data: board,
		isLoading: isBoardLoading,
		isError,
	} = api.boards.getBoard.useQuery(boardId ?? "");

	const { data: member, isLoading: isMemberLoading } =
		api.members.getMember.useQuery({
			userId: user?.id,
		});

	const { mutateAsync: updateBoard, isLoading: isUpdating } =
		api.boards.updateBoard.useMutation();

	const { mutateAsync: removeBoard } = api.boards.removeBoard.useMutation();
	const { mutateAsync: leaveBoard } = api.boards.removeMember.useMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm<Values>({
		resolver: zodResolver(BoardBodyValidator.partial()),
		defaultValues: {
			name: board?.name,
			imageUrl: board?.imageUrl,
		},
	});

	const onSubmit = handleSubmit(async (data) => {
		await updateBoard({
			id: boardId,
			board: data,
		});
	});

	const [chosenImage, setChosenImage] = useState<string | undefined>(
		board?.imageUrl
	);

	const handleDelete = async () => {
		if (member?.role === "OWNER") {
			await removeBoard(boardId ?? "");
		} else {
			await leaveBoard(boardId);
		}

		await router.push("/dashboard");
	};

	return (
		<PrivateLayout>
			<section className="mx-auto max-w-screen-xl px-4 py-3">
				<div className="mb-4 flex items-center justify-between gap-5">
					<h1 className=" text-2xl text-white md:text-4xl">
						Board settings
					</h1>
					<Button
						isLoading={isMemberLoading}
						onClick={handleDelete}
						colorScheme="red"
					>
						{member?.role === "OWNER"
							? "Delete board"
							: "Leave board"}
					</Button>
				</div>

				<div className="mx-auto max-w-md">
					<form onSubmit={onSubmit}>
						<div className="mb-8">
							<FormControl isRequired className="mb-4">
								<FormLabel>Board name</FormLabel>
								<Input
									placeholder="Name"
									{...register("name", {
										required: true,
									})}
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
												isActive
													? " border-solid border-slate-400"
													: ""
											)}
											key={url}
											onClick={() => {
												setChosenImage(url);
												setValue("imageUrl", url);
											}}
										>
											<img
												src={url}
												alt="board image"
												className="bg-slate-400 object-contain"
											/>
										</div>
									);
								})}
							</div>
							<p className="text-sm text-red-600">
								{errors.imageUrl && "Image is required"}
							</p>
						</div>

						<div className="flex justify-center">
							<Button
								type="submit"
								colorScheme="brand"
								isLoading={isUpdating}
							>
								Update
							</Button>
						</div>
					</form>
				</div>
			</section>
		</PrivateLayout>
	);
}

export default BoardSettingsPage;
