
FROM node:16-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
CMD ["npm", "run", "dev"]

FROM node:16-alpine AS dev-deps
ARG PORT
ARG MONGO_URL
ARG HOST_NAME
ARG CLOUDINARY_URL
ARG GITHUB_ID
ARG GITHUB_SECRET
ARG JWT_SECRET_SEED
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG PAYPAL_OAUTH_URL
ARG PAYPAL_ORDERS_URL
ARG PAYPAL_SECRET
ARG NEXT_PUBLIC_TAX_RATE
ARG STAGE
ARG NEXTAUTH_URL

ENV PORT $PORT
ENV MONGO_URL $MONGO_URL
ENV HOST_NAME $HOST_NAME
ENV CLOUDINARY_URL $CLOUDINARY_URL
ENV GITHUB_ID $GITHUB_ID
ENV GITHUB_SECRET $GITHUB_SECRET
ENV JWT_SECRET_SEED $JWT_SECRET_SEED
ENV NEXTAUTH_SECRET $NEXTAUTH_SECRET
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID $NEXT_PUBLIC_PAYPAL_CLIENT_ID
ENV PAYPAL_OAUTH_URL $PAYPAL_OAUTH_URL
ENV PAYPAL_ORDERS_URL $PAYPAL_ORDERS_URL
ENV PAYPAL_SECRET $PAYPAL_SECRET
ENV NEXT_PUBLIC_TAX_RATE $NEXT_PUBLIC_TAX_RATE
ENV STAGE $STAGE
ENV NEXTAUTH_URL $NEXTAUTH_URL

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
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