import React from "react";
import { PrivateLayout } from "~/layouts/PrivateLayout";
import Head from "next/head";
import { Button, SimpleGrid } from "@chakra-ui/react";
import { Board, BoardSkeleton } from "~/components/Board";
import Link from "next/link";
import { api } from "~/utils/api";

const DashboardPage = () => {
	const {
		data: boards,
		isLoading,
		isError,
	} = api.boards.getBoards.useQuery();

	return (
		<PrivateLayout>
			<Head>
				<title>Taskmate | Dashboard</title>
			</Head>
			<div className="px-4 py-3">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-4xl text-white">Dashboard</h1>
					<Button as={Link} href="/boards/new" colorScheme="brand">
						Create a board
					</Button>
				</div>
				<section>
					<SimpleGrid
						minChildWidth="250px"
						className="justify-items-center gap-x-3 gap-y-4"
					>
						{isLoading ? (
							<>
								<BoardSkeleton />
								<BoardSkeleton />
								<BoardSkeleton />
							</>
						) : isError ? (
							<div>
								Something went wrong. Please try again later.
							</div>
						) : (
							boards.map((board) => (
								<Board
									key={board.id}
									name={board.name}
									imageUrl={board.imageUrl}
									as={Link}
									href={`/boards/${board.id}`}
									className="cursor-pointer border border-slate-600 shadow"
								/>
							))
						)}
					</SimpleGrid>
				</section>
			</div>
		</PrivateLayout>
	);
};

export default DashboardPage;
