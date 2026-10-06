import type { NextConfig } from "next";

function stripTrailingSlashes(value: string | undefined) {
  let url = value?.trim() ?? "";
  while (url.endsWith("/")) url = url.slice(0, -1);
  return url;
}

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites() {
    const booking = stripTrailingSlashes(process.env.BOOKING_API_URL);
    const search = stripTrailingSlashes(process.env.SEARCH_API_URL);

    return [
      ...(booking
        ? [{ source: "/api/booking/:path*", destination: `${booking}/:path*` }]
        : []),
      ...(search
        ? [{ source: "/api/search/:path*", destination: `${search}/:path*` }]
        : []),
    ];
  },
};

export default nextConfig;
