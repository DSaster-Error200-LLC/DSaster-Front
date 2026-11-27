import { defineConfig, defineTransformer } from "orval";

const searchRelease = "v1.0.0";

/**
 * Local snapshot of the BookingService v1.0.0 OpenAPI contract (commit
 * fa00fba), fetched from the service's Swagger endpoint. Point this at a
 * running instance to regenerate the client straight from it:
 *
 *   BOOKING_OPENAPI_URL=http://localhost:5283/swagger/v1/swagger.json pnpm api
 *
 * The committed snapshot keeps `pnpm api` working offline (and in CI).
 */
const bookingSpec = process.env.BOOKING_OPENAPI_URL ?? "./openapi/booking.json";

/**
 * Swashbuckle does not emit `required` nor the C# non-nullable reference
 * types, so every property arrives as optional and nullable. These are the
 * properties the contract really allows to be null; the rest are required.
 */
const nullableBookingProperties: Readonly<Record<string, readonly string[]>> = {
  ErrorResponse: ["details", "errors"],
  TicketResponse: ["purchasedAtUtc"],
};

const fixBookingNullability = defineTransformer((spec) => {
  for (const [schemaName, schema] of Object.entries(
    spec.components?.schemas ?? {},
  )) {
    if (!schema || typeof schema !== "object" || !("properties" in schema)) {
      continue;
    }

    const { properties } = schema;
    if (!properties || typeof properties !== "object") continue;

    const nullable = new Set(nullableBookingProperties[schemaName]);
    for (const [propertyName, property] of Object.entries(properties)) {
      if (nullable.has(propertyName)) continue;
      delete (property as { nullable?: boolean }).nullable;
    }

    schema.required = Object.keys(properties).filter(
      (propertyName) => !nullable.has(propertyName),
    );
  }

  return spec;
});

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
      target: bookingSpec,
      override: {
        transformer: fixBookingNullability,
      },
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
