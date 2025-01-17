FROM alpine:3.21.2 AS base
WORKDIR /app
ENV NODE_ENV="production"

# ===========================
# Build Stage
# ===========================
FROM base AS build
RUN apk -U add build-base gyp pkgconfig python3 nodejs npm
COPY package.json ./
RUN npm install --package-lock-only
RUN npm ci --include=dev
COPY . .
RUN npm run build
RUN npm prune --omit=dev


# ===========================
# Runtime Stage
# ===========================
FROM base AS run
RUN apk add --no-cache nodejs
COPY --from=build /app/.next/standalone /app
COPY --from=build /app/.next/static /app/.next/static
COPY --from=build /app/public /app/public
EXPOSE 3000
CMD ["node", "server.js"]
