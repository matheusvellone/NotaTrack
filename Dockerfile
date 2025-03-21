ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS dev
WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "dev"]

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true NODE_ENV=production

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN rm -rf .next/cache

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
USER node

RUN apk add --no-cache tzdata

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/next.config.ts .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/api/status || exit 1

CMD ["npm", "start"]
