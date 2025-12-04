#!/bin/bash

# Orchestrates running integration tests: starts dev server if needed, runs Docker tests, cleans up

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$PROJECT_ROOT"

echo "=========================================="
echo "Docker Integration Tests"
echo "=========================================="

if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✓ Development server already running on port 3000"
  SERVER_STARTED_HERE=false
else
  echo "Starting development server..."
  yarn serve > /dev/null 2>&1 &
  SERVER_PID=$!
  SERVER_STARTED_HERE=true

  trap "echo 'Stopping server...'; kill $SERVER_PID 2>/dev/null || true" EXIT

  echo "Waiting for server to be ready..."
  timeout=60
  elapsed=0
  while ! curl -s http://localhost:3000 > /dev/null 2>&1; do
    if [ $elapsed -ge $timeout ]; then
      echo "❌ Server did not start within ${timeout}s"
      exit 1
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done
  echo "✓ Server is ready"
fi

echo "Running tests in Docker..."
cd "$SCRIPT_DIR"

docker compose run --rm test-runner "$@"
TEST_EXIT_CODE=$?

# Only stop server if we started it
if [ "$SERVER_STARTED_HERE" = true ]; then
  echo "Stopping development server..."
  kill $SERVER_PID 2>/dev/null || true
fi

exit $TEST_EXIT_CODE
