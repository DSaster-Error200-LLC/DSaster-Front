# DSaster-Front

## Project setup

```bash
pnpm install
```

Create `.env.local` in this application directory and set both service URLs:

```dotenv
BOOKING_API_URL=https://your-booking-host
SEARCH_API_URL=https://your-search-host
```

Replace the example URLs with your service addresses. Both variables are required
for development and production builds. They stay on the server; do not prefix
them with `NEXT_PUBLIC_`.

Generated browser clients use `/api/booking` and `/api/search`. Next.js rewrites
forward those requests to the corresponding service, removing the proxy prefix.
Configure both variables in the deployment build environment and rebuild when
service URLs change.

After changing API schemas or mutator configuration, regenerate clients with
`pnpm api`. Do not edit files under `api/` manually. API functions return response
payloads directly rather than Axios response objects.

## Run the project

```bash
pnpm dev
```

## Run with Docker

Install Docker and start its daemon. Run the following commands from
`src/dsaster-front/`, where the `Dockerfile` is located.

Build the production image, replacing the example URLs with service addresses
reachable from the container:

```bash
docker build \
  --build-arg BOOKING_API_URL=https://your-booking-host \
  --build-arg SEARCH_API_URL=https://your-search-host \
  -t dsaster-front .
```

Both build arguments are required. Docker excludes `.env*` files from the build
context. The API proxy URLs are fixed at build time; rebuild the image when they
change. Passing different URLs to `docker run` does not update the proxies.
Inside the container, `localhost` and `127.0.0.1` refer to the container itself.

Start the container, mapping host port `3001` to container port `3000` so
SearchService can continue using host port `3000`:

```bash
docker run --detach --rm --name dsaster-front -p 3001:3000 dsaster-front
```

Open [http://localhost:3001](http://localhost:3001). To stop and remove the
container, run:

```bash
docker stop dsaster-front
```

## Run before commit

```bash
pnpm build
pnpm lint
pnpm format
pnpm format:check
pnpm test
```
