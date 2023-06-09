import React from "react";
import type { Status } from "@prisma/client";
import { cx } from "~/styles/cx";
import { type IssueRepresentation } from "~/contracts/issue.representation.validator";
import { Issue } from "~/components/Issue";

type BoardColumnProps = {
	id: Status;
	name: string;
	issues: IssueRepresentation[];
	className?: string;
	openModal: () => void;
};

export const BoardColumn = ({ id, name, className, issues, openModal }: BoardColumnProps) => {
	return (
		<div id={id} className={cx("min-w-[200px] border-x border-solid border-slate-400 text-center", className)}>
			<p className="border-b border-solid border-slate-500 py-4 text-slate-300">{name}</p>
			<div className="flex flex-col gap-3 p-2 ">
				{issues.map((issue) => (
					<Issue
						key={issue.id}
						id={issue.id}
						title={issue.title}
						description={issue.description}
						openModal={openModal}
					/>
				))}
			</div>
		</div>
	);
};

type BoardColumnSkeletonProps = {
	className?: string;
};

export const BoardColumnSkeleton = ({ className }: BoardColumnSkeletonProps) => {
	return (
		<div className={cx("min-w-[200px] border-x border-solid border-slate-400 text-center", className)}>
			<p className="animate-pulse border-b border-solid border-slate-500 py-4 text-slate-300">Status</p>
			<div className="flex flex-col gap-3 p-2 ">
				<div className="h-20 animate-pulse rounded-lg bg-slate-600" />
				<div className="h-20 animate-pulse rounded-lg bg-slate-600" />
				<div className="h-20 animate-pulse rounded-lg bg-slate-600" />
				<div className="h-20 animate-pulse rounded-lg bg-slate-600" />
			</div>
		</div>
	);
};
