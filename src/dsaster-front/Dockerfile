ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ENV HUSKY=0 NEXT_TELEMETRY_DISABLED=1 COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN corepack enable && corepack install
RUN pnpm install --frozen-lockfile

COPY . .
ARG BOOKING_API_URL
ARG SEARCH_API_URL
RUN : "${BOOKING_API_URL:?BOOKING_API_URL build argument is required}" \
    && : "${SEARCH_API_URL:?SEARCH_API_URL build argument is required}" \
    && pnpm build


FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
