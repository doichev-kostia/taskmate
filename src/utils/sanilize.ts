import DOMPurify from "dompurify";

export const sanitize = (input: string) => {
	return typeof window !== "undefined" ? DOMPurify.sanitize(input) : input;
};
