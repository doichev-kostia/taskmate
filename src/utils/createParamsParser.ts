import { z } from "zod";
import { ZodRawShape } from "zod/lib/types";
import { isBrowser } from "~/utils/isBrowser";
import { ParsedUrlQuery } from "querystring";

export const createParamsParser = <S extends ZodRawShape>(
	schema: S,
	query: ParsedUrlQuery
) => {
	let zodSchema = z.object(schema);
	const browser = isBrowser();
	if (!browser) {
		zodSchema = zodSchema.partial() as any;
	}
	return zodSchema.parse(query);
};
