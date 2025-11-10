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

# Install bash for entrypoint script
RUN apk add --no-cache bash

# Copy Next.js build output
COPY --from=builder /app/.next .next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/scripts ./scripts

# Copy public directory with JSON files for migration
# Important: These JSON files are needed for the migration process
COPY --from=builder /app/public ./public

# Make entrypoint script executable
RUN chmod +x /app/scripts/docker-entrypoint.sh

# Create data directory for SQLite
RUN mkdir -p /app/data

# Verify JSON files exist for migration
RUN echo "Checking for migration JSON files..." && \
    ls -la /app/public/featured-music/albums.json && \
    ls -la /app/public/featured-projects/json/projects.json && \
    echo "✓ All JSON files found" || \
    echo "⚠️  Warning: Some JSON files are missing"

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
