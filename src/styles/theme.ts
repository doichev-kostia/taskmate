import {
	extendTheme,
	type Theme,
	type ThemeConfig,
	withDefaultColorScheme,
} from "@chakra-ui/react";

const config: ThemeConfig = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};

export const theme = extendTheme(
	{
		config,
		// slate
		colors: {
			brand: {
				50: "#f8fafc",
				100: "#f1f5f9",
				200: "#e2e8f0",
				300: "#cbd5e1",
				400: "#94a3b8",
				500: "#64748b",
				600: "#475569",
				700: "#334155",
				800: "#1e293b",
				900: "#0f172a",
			},
		},
		semanticTokens: {
			colors: {
				"chakra-body-text": "#94a3b8",
				"chakra-body-bg": "#0f172a",
			},
		},
	},
	withDefaultColorScheme({ colorScheme: "slate" })
) as Theme;
