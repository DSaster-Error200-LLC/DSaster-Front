# DSaster-Front

## Project setup

```bash
pnpm install
```

Create `.env.local` in this application directory and set both service URLs:

```dotenv
BOOKING_API_URL=http://127.0.0.1:5283
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

## Run before commit

```bash
pnpm build
pnpm lint
pnpm format
pnpm format:check
pnpm test
```
