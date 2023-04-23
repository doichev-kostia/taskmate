import React from "react";
import { Card, CardBody } from "@chakra-ui/card";
import { Heading } from "@chakra-ui/react";
import { type As, type MergeWithAs } from "@chakra-ui/system";
import { cx } from "~/styles/cx";

type BoardProps<Component extends As> = MergeWithAs<
	React.ComponentProps<Component>,
	React.ComponentProps<Component>,
	{
		imageUrl: string;
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
				<img src={imageUrl} alt={name} className="mb-3 rounded-lg" />
				<Heading size="sm" className="px-2">
					{name}
				</Heading>
			</CardBody>
		</Card>
	);
}
