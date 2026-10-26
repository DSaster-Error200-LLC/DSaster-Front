import axios, { type AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";

const bookingAxios = axios.create({ baseURL: "/api/booking" });
axiosRetry(bookingAxios, { retries: 0 });

const searchAxios = axios.create({ baseURL: "/api/search" });

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
