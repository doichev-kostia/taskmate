import CookieService from "~/cookie-service";
import { toast } from "react-toastify";

export const logout = () => {
	CookieService.remove("access_token", { path: "/" });
	toast.info("Your session has expired. Please log in again.");

	setTimeout(() => {
		const search = new URLSearchParams();
		search.set("redirect_url", window.location.pathname);
		window.location.href = "/sign-in" + "?" + search.toString();
	}, 1000);
};
