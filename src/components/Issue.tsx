import React from "react";
import { Card, CardBody, CardHeader } from "@chakra-ui/card";
import { useRouter } from "next/router";
import { sanitize } from "~/utils/sanilize";

type IssueProps = {
	id: string;
	title: string;
	description?: string;
	openModal: () => void;
};

export function Issue({ id, title, description, openModal }: IssueProps) {
	const body = sanitize(description ? description.slice(0, 40) : "");
	const router = useRouter();

	const handleClick = async () => {
		const url = new URL(window.location.href);
		url.searchParams.set("issue", id);
		await router.replace(url);
		openModal();
	};

	return (
		<Card id={id} role="button" tabIndex={0} className="cursor-pointer rounded-md" onClick={handleClick}>
			<CardHeader className="p-2 text-left text-slate-300">
				<p className="text-lg">{title}</p>
			</CardHeader>
			<CardBody className="p-2 text-left text-slate-500">
				<p className="text-sm">{body}</p>
			</CardBody>
		</Card>
	);
}
