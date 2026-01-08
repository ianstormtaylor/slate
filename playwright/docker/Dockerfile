# Use Node.js 22 base (Debian-based, similar to CI ubuntu-22.04)
# Note: Can't use official Playwright image because Yarn PnP uses absolute paths
# that break when the project is mounted at a different location in Docker
FROM node:22-slim

# Install curl (for health checks) and socat (for localhost port forwarding)
RUN apt-get update && \
    apt-get install -y curl socat && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable

WORKDIR /app

# Install globally to avoid Yarn PnP path resolution issues in container
RUN npm install -g @playwright/test@1.52.0

RUN playwright install --with-deps

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
