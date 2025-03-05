ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci -f

COPY . .

ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build

RUN rm -rf .next/cache
RUN npm prune --production

FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app
RUN apk add --no-cache tzdata

USER node

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
