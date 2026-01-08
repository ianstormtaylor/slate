#!/bin/bash
set -e

echo "=========================================="
echo "Docker Integration Tests"
echo "=========================================="

# Default to host.docker.internal if not overridden
if [ -z "$PLAYWRIGHT_BASE_URL" ]; then
  PLAYWRIGHT_BASE_URL="http://host.docker.internal:3000"
fi

echo "Waiting for development server on host..."

timeout=60
elapsed=0
while ! curl -s "$PLAYWRIGHT_BASE_URL" > /dev/null; do
  if [ $elapsed -ge $timeout ]; then
    echo "❌ Server did not start within ${timeout}s"
    exit 1
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done

echo "✓ Server is ready on host"

# Forward localhost:3000 to host for tests that use hardcoded localhost URLs
echo "Setting up port forwarding from localhost:3000 to host..."
socat TCP-LISTEN:3000,fork,reuseaddr TCP:host.docker.internal:3000 &
SOCAT_PID=$!

sleep 1

cd /app/playwright/docker
playwright test --config=playwright.config.docker.ts "$@"
TEST_EXIT_CODE=$?

kill $SOCAT_PID 2>/dev/null || true

exit $TEST_EXIT_CODE
