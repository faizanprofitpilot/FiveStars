#!/bin/bash

# Test Twilio SMS endpoint
# Usage: ./test-twilio.sh <phone-number> [message]
# Example: ./test-twilio.sh +14155551234 "Test message"

PHONE="$1"
MESSAGE="${2:-Test message from FiveStars}"

if [ -z "$PHONE" ]; then
  echo "Usage: ./test-twilio.sh <phone-number> [message]"
  echo "Example: ./test-twilio.sh +14155551234 \"Test message\""
  exit 1
fi

# Use localhost for local testing, or set APP_URL env var for production
BASE_URL="${APP_URL:-http://localhost:3000}"
TEST_URL="${BASE_URL}/api/twilio/test"

echo "Testing Twilio SMS endpoint..."
echo "URL: $TEST_URL"
echo "To: $PHONE"
echo "Message: $MESSAGE"
echo ""

curl -X POST "$TEST_URL" \
  -H "Content-Type: application/json" \
  -d "{\"to\": \"$PHONE\", \"body\": \"$MESSAGE\"}" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
