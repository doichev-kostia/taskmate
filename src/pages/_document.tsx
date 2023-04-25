import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import { theme } from "~/styles/theme";

export default class Document extends NextDocument {
	render() {
		return (
			<Html lang="en">
				<Head />
				<body className="bg-slate-900 text-gray-200" id="app">
					<ColorModeScript
						initialColorMode={theme.config.initialColorMode}
					/>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
