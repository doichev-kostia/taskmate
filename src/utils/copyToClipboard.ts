import { toast } from "react-toastify";

export const copyToClipboard = (text: string) => {
	void navigator.clipboard.writeText(text).then(() => {
		toast.success("Copied to clipboard");
	});
};
