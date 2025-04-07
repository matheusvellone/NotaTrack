ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

RUN apk add --no-cache tzdata

FROM base AS dev
ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]

FROM base AS builder

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npm run build
RUN rm -rf .next/cache; npm prune

FROM base AS runner
ENV NODE_ENV=production

COPY drizzle drizzle
COPY screenshots screenshots
COPY public public

COPY drizzle.config.ts .
COPY next.config.ts .
COPY package.json .

COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules

EXPOSE ${PORT:-3000}

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --tries=1 --spider http://$HOSTNAME:${PORT:-3000}/api/status || exit 1

USER node
CMD npx drizzle-kit migrate; npm start
