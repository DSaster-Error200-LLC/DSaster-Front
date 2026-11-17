import axios, { type AxiosRequestConfig } from "axios";
import { attach } from "retry-axios";

const API_TIMEOUT_MS = 1_000;
const RETRY_CONFIG = { retry: 3, backoffType: "exponential" } as const;

function createApiAxios(baseURL: string) {
  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT_MS,
    raxConfig: RETRY_CONFIG,
  });
  attach(instance);
  return instance;
}

const bookingAxios = createApiAxios("/api/booking");
const searchAxios = createApiAxios("/api/search");

export function bookingInstance<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  return bookingAxios<T>({ ...config, ...options }).then(({ data }) => data);
}

export function searchInstance<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  return searchAxios<T>({ ...config, ...options }).then(({ data }) => data);
}
