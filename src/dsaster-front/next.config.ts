import type { NextConfig } from "next";

function stripTrailingSlashes(value: string | undefined) {
  let url = value?.trim() ?? "";
  while (url.endsWith("/")) url = url.slice(0, -1);
  return url;
}

const nextConfig: NextConfig = {
  rewrites() {
    const booking = stripTrailingSlashes(process.env.BOOKING_API_URL);
    const search = stripTrailingSlashes(process.env.SEARCH_API_URL);

    if (!booking || !search) {
      throw new Error("BOOKING_API_URL and SEARCH_API_URL must be set.");
    }

    return [
      { source: "/api/booking/:path*", destination: `${booking}/:path*` },
      { source: "/api/search/:path*", destination: `${search}/:path*` },
    ];
  },
};

export default nextConfig;
