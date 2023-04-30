/** @type {import("prettier").Config} */
const config = {
	semi: true,
	singleQuote: false,
	printWidth: 120,
	plugins: [require.resolve("prettier-plugin-tailwindcss")]
};

module.exports = config;
