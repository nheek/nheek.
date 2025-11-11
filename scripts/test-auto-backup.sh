#!/bin/bash

# Test Automated Backup System
# This script tests the automated backup endpoint locally

# Configuration
URL="http://localhost:3000/api/backup/auto"
SECRET="${CRON_SECRET:-change_me_in_production}"

echo "🧪 Testing Automated Backup System"
echo "=================================="
echo ""
echo "URL: $URL"
echo "Secret: ${SECRET:0:10}..."
echo ""

# Make the request
echo "📤 Sending backup request..."
RESPONSE=$(curl -s -X POST "$URL" \
  -H "x-cron-secret: $SECRET" \
  -H "Content-Type: application/json" \
  -w "\nHTTP_STATUS:%{http_code}")

# Extract HTTP status
HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS.*//')

echo ""
echo "📥 Response (Status: $HTTP_STATUS):"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# Check status
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ Backup request successful!"
elif [ "$HTTP_STATUS" -eq 401 ]; then
  echo "❌ Authentication failed. Check CRON_SECRET environment variable."
else
  echo "⚠️  Request completed with status: $HTTP_STATUS"
fi

echo ""
echo "💡 Tips:"
echo "  - Make sure your Next.js dev server is running (npm run dev)"
echo "  - Set CRON_SECRET environment variable if you changed it"
echo "  - Enable auto-backup in admin dashboard (/admin)"
echo "  - Check backup files in: ./data/backups/"
