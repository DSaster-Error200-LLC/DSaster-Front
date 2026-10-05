import { defineConfig } from "orval";

const searchRelease = "v1.0.0";

export default defineConfig({
  search: {
    input: {
      target:
        "https://github.com/DSaster-Error200-LLC" +
        `/DSaster-SearchService/releases/download/${searchRelease}` +
        "/openapi.yml",
    },
    output: {
      target: "./api/search.ts",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./app/lib/api-mutator.ts",
          name: "searchInstance",
        },
      },
    },
  },
  booking: {
    input: {
      target: "./openapi/booking.json",
    },
    output: {
      target: "./api/booking.ts",
      httpClient: "axios",
      headers: true,
      override: {
        mutator: {
          path: "./app/lib/api-mutator.ts",
          name: "bookingInstance",
        },
      },
    },
  },
});
