FROM node:22-alpine AS base
FROM base AS builder

WORKDIR /app

COPY ./ ./

RUN npm ci && npm run build:node

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 9890

CMD ["node", "/app/dist/index.node.js"]