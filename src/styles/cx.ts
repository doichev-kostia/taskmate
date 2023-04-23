import classNames from "classnames";
import { twMerge } from "tailwind-merge";

// function for merging tailwind classes with classnames
export function cx(...args: classNames.ArgumentArray) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	return twMerge(classNames(...args));
}
