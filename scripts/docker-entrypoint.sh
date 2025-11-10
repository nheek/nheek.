#!/bin/sh
set -e

echo "🚀 Starting nheek application..."

# Create data directory if it doesn't exist
mkdir -p /app/data

# Always run migration script (it will handle schema updates)
if [ ! -f "/app/data/nheek.db" ]; then
  echo "📦 Database not found. Running initial migration..."
else
  echo "📦 Database found. Checking for schema updates..."
fi

# Run migration script
node /app/scripts/docker-migrate.js

echo "✅ Migration check completed!"

# Start the Next.js application
echo "🌐 Starting Next.js server..."
exec npm run start-app
