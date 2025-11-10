FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
ENV S3_DOMAIN="REPLACE_ME_S3_DOMAIN"

RUN corepack enable
RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S notroot
RUN adduser -S notroot -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=notroot:notroot /app/.next/standalone ./
COPY --from=builder --chown=notroot:notroot /app/.next/static ./.next/static

RUN sed -i 's/"REPLACE_ME_S3_DOMAIN"/process.env.S3_DOMAIN/g' ./server.js

USER notroot

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
