import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ChakraProvider } from "@chakra-ui/react";
import { BaseLayout } from "~/layouts/BaseLayout";
import { theme } from "~/styles/theme";
import { ToastContainer } from "react-toastify";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ClerkProvider>
			<ChakraProvider theme={theme}>
				<BaseLayout>
					<Component {...pageProps} />
				</BaseLayout>
				<ToastContainer />
			</ChakraProvider>
		</ClerkProvider>
	);
};

export default api.withTRPC(MyApp);
