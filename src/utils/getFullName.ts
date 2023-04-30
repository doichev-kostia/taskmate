export const getFullName = (firstName?: string | null, lastName?: string | null) => {
	if (!firstName && lastName) {
		return `Mr or Ms ${lastName}`;
	}

	if (!lastName && firstName) {
		return firstName;
	}

	if (!firstName || !lastName) {
		return "Me";
	}

	return `${firstName} ${lastName}`;
};
