import React, { useState } from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoardBodyValidator } from "~/contracts/board.body.validator";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { type z } from "zod";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BOARD_IMAGES } from "~/utils/constants";
import { cx } from "~/styles/cx";

type Values = z.infer<typeof BoardBodyValidator>;

function CreateBoardPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<Values>({
		resolver: zodResolver(BoardBodyValidator),
	});

	const [chosenImage, setChosenImage] = useState<string | undefined>(undefined);

	const router = useRouter();

	const { mutateAsync: createBoard } = api.boards.createBoard.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		try {
			await createBoard({
				imageUrl: data.imageUrl,
				name: data.name,
			});
			await router.push("/dashboard");
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong. Please try again later.");
		}
	});

	return (
		<PrivateLayout>
			<section className="px-4 py-3">
				<h1 className="mb-4 text-2xl text-white md:text-4xl">Create a board</h1>

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
												isActive ? " border-solid border-slate-400" : ""
											)}
											key={url}
											onClick={() => {
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
						</div>

						<div className="flex justify-center">
							<Button type="submit" colorScheme="brand">
								Create
							</Button>
						</div>
					</form>
				</div>
			</section>
		</PrivateLayout>
	);
}

export default CreateBoardPage;
