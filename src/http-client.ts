import axios, {
	AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type CreateAxiosDefaults,
	HttpStatusCode,
	type InternalAxiosRequestConfig,
	type RawAxiosRequestConfig,
} from "axios";
import CookieService from "~/cookie-service";
import { z } from "zod";
import { ACCESS_TOKEN_KEY } from "~/utils/constants";
import { logout } from "~/utils/logout";
import { env } from "~/env.mjs";

const isLoginUrl = (url: string): boolean => /\/auth\/oauth/.test(url);

class HttpClient {
	private readonly axios: AxiosInstance;

	constructor(config: CreateAxiosDefaults) {
		this.axios = axios.create(config);
		this.axios.interceptors.request.use(this.requestInterceptor.bind(this));
		this.axios.interceptors.response.use(
			this.responseInterceptor.bind(this),
			this.responseErrorInterceptor.bind(this)
		);
	}

	public async get<ResponseData = unknown, RequestData = unknown>(
		url: string,
		config?: RawAxiosRequestConfig<RequestData>
	): Promise<ResponseData> {
		const response = await this.axios.get<ResponseData, AxiosResponse<ResponseData, RequestData>, RequestData>(
			url,
			config
		);
		return response.data;
	}

	public async delete<ResponseData = unknown, RequestData = unknown>(
		url: string,
		config?: RawAxiosRequestConfig<RequestData>
	): Promise<ResponseData> {
		const response = await this.axios.delete<ResponseData, AxiosResponse<ResponseData, RequestData>, RequestData>(
			url,
			config
		);
		return response.data;
	}

	public async post<ResponseData = unknown, RequestData = unknown>(
		url: string,
		data?: RequestData,
		config?: RawAxiosRequestConfig<RequestData>
	): Promise<ResponseData> {
		const response = await this.axios.post<ResponseData, AxiosResponse<ResponseData, RequestData>, RequestData>(
			url,
			data,
			config
		);
		return response.data;
	}

	public async put<ResponseData = unknown, RequestData = unknown>(
		url: string,
		data?: RequestData,
		config?: RawAxiosRequestConfig<RequestData>
	): Promise<ResponseData> {
		const response = await this.axios.put<ResponseData, AxiosResponse<ResponseData, RequestData>, RequestData>(
			url,
			data,
			config
		);
		return response.data;
	}

	public async patch<ResponseData = unknown, RequestData = unknown>(
		url: string,
		data?: RequestData,
		config?: RawAxiosRequestConfig<RequestData>
	): Promise<ResponseData> {
		const response = await this.axios.patch<ResponseData, AxiosResponse<ResponseData, RequestData>, RequestData>(
			url,
			data,
			config
		);
		return response.data;
	}

	/**
	 * Needed to get all the request data from the response, not just the body
	 */
	public request<
		ResponseData = unknown,
		RequestData = unknown,
		Response extends AxiosResponse<ResponseData, RequestData> = AxiosResponse<ResponseData, RequestData>
	>(config: RawAxiosRequestConfig<RequestData>): Promise<Response> {
		return this.axios.request<ResponseData, Response, RequestData>(config);
	}

	private requestInterceptor(config: InternalAxiosRequestConfig<unknown>): InternalAxiosRequestConfig<unknown> {
		const newConfig = { ...config };

		const accessToken = CookieService.get(ACCESS_TOKEN_KEY);
		if (!accessToken) {
			return newConfig;
		}

		newConfig.headers.set("Authorization", `Bearer_${accessToken}`);

		return newConfig;
	}

	private responseInterceptor(response: AxiosResponse<unknown>): AxiosResponse<unknown> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const { request } = response;

		if (isLoginUrl(request.responseURL)) {
			const result = z.string().safeParse((response.data as any)?.token);

			if (result.success) {
				const expires = new Date();
				expires.setFullYear(expires.getFullYear() + 1);
				CookieService.set(ACCESS_TOKEN_KEY, result.data, {
					expires,
				});
			} else {
				logout();
			}
		}

		return response;
	}

	private responseErrorInterceptor(error: Error): Promise<Error> {
		if (error instanceof AxiosError && error?.isAxiosError) {
			const { response } = error;

			if (response?.status === HttpStatusCode.Unauthorized) {
				logout();
			}
		}

		console.error(error);
		return Promise.reject(error);
	}
}

export const httpClient = new HttpClient({
	baseURL: env.NEXT_PUBLIC_API_URL,
});
