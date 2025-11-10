#!/bin/sh
set -e

echo "🚀 Starting nheek application..."

# Check if database exists
if [ ! -f "/app/data/nheek.db" ]; then
  echo "📦 Database not found. Running initial migration..."
  
  # Create data directory if it doesn't exist
  mkdir -p /app/data
  
  # Run migration script
  node /app/scripts/docker-migrate.js
  
  echo "✅ Migration completed!"
else
  echo "✅ Database found. Skipping migration."
fi

# Start the Next.js application
echo "🌐 Starting Next.js server..."
exec npm run start-app
