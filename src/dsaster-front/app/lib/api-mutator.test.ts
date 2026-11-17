import {
  AxiosError,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import { describe, expect, it } from "vitest";
import { bookingInstance, searchInstance } from "@/app/lib/api-mutator";

async function captureRequestConfig(
  request: (adapter: AxiosAdapter) => Promise<string>,
): Promise<InternalAxiosRequestConfig> {
  let capturedConfig: InternalAxiosRequestConfig | undefined;
  const adapter: AxiosAdapter = (config) => {
    capturedConfig = config;
    return Promise.resolve({
      data: "ok",
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  };

  await request(adapter);

  if (!capturedConfig) {
    throw new Error("The Axios adapter was not called");
  }
  return capturedConfig;
}

describe("API clients", () => {
  it.each([
    {
      name: "booking",
      baseURL: "/api/booking",
      request: (adapter: AxiosAdapter) =>
        bookingInstance<string>({ url: "/test", method: "GET", adapter }),
    },
    {
      name: "search",
      baseURL: "/api/search",
      request: (adapter: AxiosAdapter) =>
        searchInstance<string>({ url: "/test", method: "GET", adapter }),
    },
  ])(
    "applies global resiliency defaults to $name endpoints",
    async ({ baseURL, request }) => {
      const config = await captureRequestConfig(request);

      expect(config.baseURL).toBe(baseURL);
      expect(config.timeout).toBe(1_000);
      expect(config.raxConfig).toMatchObject({
        retry: 3,
        backoffType: "exponential",
      });
    },
  );

  it("retries a failing endpoint at most three times", async () => {
    let attempts = 0;
    const adapter: AxiosAdapter = (config) => {
      attempts += 1;
      if (attempts <= 3) {
        return Promise.reject(
          new AxiosError("Server error", undefined, config, undefined, {
            data: "error",
            status: 500,
            statusText: "Server Error",
            headers: {},
            config,
          }),
        );
      }

      return Promise.resolve({
        data: "ok",
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });
    };

    await expect(
      bookingInstance<string>({
        url: "/test",
        method: "GET",
        adapter,
      }),
    ).resolves.toBe("ok");
    expect(attempts).toBe(4);
  });
});
