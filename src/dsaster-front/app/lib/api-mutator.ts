import axios, { type AxiosRequestConfig } from "axios";

const bookingAxios = axios.create({ baseURL: "/api/booking" });
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
