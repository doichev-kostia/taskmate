import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { ChakraProvider } from "@chakra-ui/react";
import { BaseLayout } from "~/layouts/BaseLayout";
import { theme } from "~/styles/theme";
import { ToastContainer } from "react-toastify";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ChakraProvider theme={theme}>
			<BaseLayout>
				<Component {...pageProps} />
			</BaseLayout>
			<ToastContainer />
		</ChakraProvider>
	);
};

export default api.withTRPC(MyApp);
