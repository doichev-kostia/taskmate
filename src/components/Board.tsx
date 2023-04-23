import React from "react";
import { Card, CardBody } from "@chakra-ui/card";
import { Heading } from "@chakra-ui/react";
import { type As, type MergeWithAs } from "@chakra-ui/system";
import { cx } from "~/styles/cx";

type BoardProps<Component extends As> = MergeWithAs<
	React.ComponentProps<Component>,
	React.ComponentProps<Component>,
	{
		imageUrl?: string | null;
		name: string;
	},
	Component
>;

export function Board<Component extends As>({
	imageUrl,
	name,
	as,
	...other
}: BoardProps<Component>) {
	return (
		<Card
			maxW="sm"
			as={as}
			{...other}
			className={cx("rounded-lg", other.className)}
		>
			<CardBody className="p-0 pb-3">
				<img
					src={imageUrl ?? "/board-placeholder.webp"}
					alt={name}
					className="mb-3 h-60 w-full rounded-lg object-cover"
					title={imageUrl ? name : "Photo by Adam Koolon Unsplash"}
				/>
				<Heading size="sm" className="px-2">
					{name}
				</Heading>
			</CardBody>
		</Card>
	);
}

export function BoardSkeleton() {
	return (
		<Card maxW="sm" className="rounded-lg">
			<CardBody className="p-0 pb-3">
				<div className="mb-3 h-52 animate-pulse rounded-lg bg-slate-600" />
				<div className="h-6 animate-pulse rounded-lg bg-slate-600" />
			</CardBody>
		</Card>
	);
}
