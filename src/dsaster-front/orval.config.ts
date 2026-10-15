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
      // Local copy of the BookingService v0.0.0-beta spec
      // (https://github.com/zackspike/sales-module/releases/tag/v0.0.0-beta)
      // with its nullability annotations fixed: the service generates every
      // property as nullable because its OpenAPI setup ignores the C#
      // nullability annotations.
      // TODO(BookingService): restore the release download URL in Orval once
      // the published spec respects nullability, and drop this file.
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
