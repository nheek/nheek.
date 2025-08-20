FROM node:23-alpine AS deps
WORKDIR /app

# Copy only package.json first to generate lock file if needed
COPY package.json ./

# Generate package-lock.json if it doesn't exist
RUN npm install --no-cache --legacy-peer-deps

# Install dependencies
# RUN npm ci --legacy-peer-deps

# ---- Build stage ----
FROM node:23-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---- Final stage ----
FROM node:23-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "run", "start-app"]
