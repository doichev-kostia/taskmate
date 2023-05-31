import { ACCESS_TOKEN_KEY } from "~/utils/constants";
import CookieService from "~/cookie-service";
import jwtDecode from "jwt-decode";
import { z } from "zod";
import { isBrowser } from "~/utils/isBrowser";

const TokenSchema = z.object({
	userId: z.string(),
});

export function useTokenData(): z.infer<typeof TokenSchema> {
	const token = CookieService.get(ACCESS_TOKEN_KEY);

	if (!token) {
		if (isBrowser()) {
			window.location.href = "/sign-in";
		}
		return {} as never;
	}

	try {
		return TokenSchema.parse(jwtDecode(token));
	} catch (error) {
		if (isBrowser()) {
			window.location.href = "/sign-in";
		}
		return {} as never;
	}
}
