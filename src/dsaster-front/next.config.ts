import type { NextConfig } from "next";

const DEFAULT_SEARCH_API_URL = "http://localhost:3000";
const DEFAULT_BOOKING_API_URL = "http://localhost:5283";

function stripTrailingSlashes(value: string) {
  let url = value.trim();
  while (url.endsWith("/")) url = url.slice(0, -1);
  return url;
}

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites() {
    const search = stripTrailingSlashes(
      process.env.SEARCH_API_URL ?? DEFAULT_SEARCH_API_URL,
    );
    const booking = stripTrailingSlashes(
      process.env.BOOKING_API_URL ?? DEFAULT_BOOKING_API_URL,
    );

    return [
      ...(search
        ? [{ source: "/api/search/:path*", destination: `${search}/:path*` }]
        : []),
      ...(booking
        ? [{ source: "/api/booking/:path*", destination: `${booking}/:path*` }]
        : []),
    ];
  },
};

export default nextConfig;
