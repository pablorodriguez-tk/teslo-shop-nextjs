
FROM node:16-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
CMD ["npm", "run", "dev"]

FROM node:16-alpine AS dev-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production

RUN npm run build

FROM node:16-alpine AS prod-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:16-alpine AS prod
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN rm -f /app/.env
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN rm -f /app/.env
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]