import React from "react";
import type { Issue, Status } from "@prisma/client";
import { cx } from "~/styles/cx";

type BoardColumnProps = {
	id: Status;
	name: string;
	issues: Issue[];
	className?: string;
};

export const BoardColumn = ({
	id,
	name,
	className,
	issues,
}: BoardColumnProps) => {
	return (
		<div
			className={cx(
				"h-full border-x border-solid border-slate-400 text-center",
				className
			)}
		>
			<p>{name}</p>
			<div></div>
		</div>
	);
};
