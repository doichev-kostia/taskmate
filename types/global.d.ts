declare global {
	interface ObjectConstructor {
		/**
		 * Needed for zod and prisma enums.
		 *
		 * Prisma declares an enum like this:
		 * export const RoleType: {
		 *   admin: 'admin',
		 *   user: 'user'
		 * };
		 *
		 * export type RoleType = (typeof RoleType)[keyof typeof RoleType]
		 *
		 * So, I cannot use z.nativeEnum(RoleType) as this is a type, not enum.
		 *
		 * In fact, in JS it's a plain object like:
		 * const RoleType = {
		 *  admin: 'admin',
		 *  user: 'user'
		 * }
		 *
		 * That's why I need to use Object.values(RoleType) to get the array of values and put it in z.enum().
		 * However, native Object.values() return ArrayLike<"admin" | "user">, which is not compatible with z.enum().
		 *
		 */
		values<T>(o: T): [T[keyof T], ...T[keyof T][]];
	}
}

export {};
