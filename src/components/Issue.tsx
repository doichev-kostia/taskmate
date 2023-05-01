import React from "react";
import { Card, CardBody, CardHeader } from "@chakra-ui/card";
import DOMPurify from "dompurify";

type IssueProps = {
	id: string;
	title: string;
	description?: string;
};

export function Issue({ id, title, description }: IssueProps) {
	const body = DOMPurify.sanitize(description ? description.slice(0, 40) : "");

	return (
		<Card id={id} role="button" tabIndex={0} className="cursor-pointer rounded-md">
			<CardHeader className="p-2 text-left text-slate-300">
				<p className="text-lg">{title}</p>
			</CardHeader>
			<CardBody className="p-2 text-left text-slate-500">
				<p className="text-sm">{body}</p>
			</CardBody>
		</Card>
	);
}
