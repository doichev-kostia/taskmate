import React from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoardBodyValidator } from "~/contracts/board.body.validator";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { z } from "zod";
import { optimizeImage } from "~/utils/optimizeImage";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

type Values = z.infer<typeof BoardBodyValidator> & {
	image: FileList;
};

function CreateBoardPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Values>({
		resolver: zodResolver(
			BoardBodyValidator.omit({ imageUrl: true }).passthrough()
		),
	});

	const router = useRouter();

	const { mutateAsync: createBoard } = api.boards.createBoard.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		if (data.image[0]) {
			const base64 = await optimizeImage(data.image[0], {
				returnType: "base64",
			});
			data.imageUrl = base64;
		}
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
				<h1 className="mb-4 text-2xl text-white md:text-4xl">
					Create a board
				</h1>

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
							<FormControl className="mb-4">
								<FormLabel>Upload an image</FormLabel>
								<Input
									className="pl-0 file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:border-slate-600 file:bg-transparent file:px-4 file:text-sm file:font-medium file:text-slate-400"
									id="file_input"
									type="file"
									accept={"image/*"}
									multiple={false}
									{...register("image")}
								/>
							</FormControl>
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
