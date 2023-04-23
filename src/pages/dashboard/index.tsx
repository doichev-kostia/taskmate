import React from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import Head from "next/head";
import { SimpleGrid } from "@chakra-ui/react";
import { Board } from "~/components/Board";
import Link from "next/link";

const boards = [
	{
		id: "1",
		name: "Board 1",
		imageUrl: "https://source.unsplash.com/random/800x600",
	},
	{
		id: "2",
		name: "Board 2",
		imageUrl: "https://source.unsplash.com/random/800x600",
	},
	{
		id: "3",
		name: "Board 3",
		imageUrl: "https://source.unsplash.com/random/800x600",
	},
	{
		id: "4",
		name: "Board 4",
		imageUrl: "https://source.unsplash.com/random/800x600",
	},
];

const DashboardPage = () => {
	return (
		<PrivateLayout>
			<Head>
				<title>Taskmate | Dashboard</title>
			</Head>
			<div className="px-4 py-3">
				<h1 className="mb-6 text-4xl text-white">Dashboard</h1>
				<section>
					<SimpleGrid
						minChildWidth="200px"
						className="gap-x-3 gap-y-4"
					>
						{boards.map((board) => (
							<Board
								key={board.id}
								name={board.name}
								imageUrl={board.imageUrl}
								as={Link}
								href={`/boards/${board.id}`}
								className="cursor-pointer border border-slate-600 shadow"
							/>
						))}
					</SimpleGrid>
				</section>
			</div>
		</PrivateLayout>
	);
};

export default DashboardPage;
