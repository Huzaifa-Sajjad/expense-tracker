# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.2.12
FROM oven/bun:${BUN_VERSION}-slim AS base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

# Install node modules
COPY bun.lock package-lock.json package.json ./
RUN bun install --ci

# Install frontend node modules
COPY --link frontend/bun.lock frontend/package.json ./frontend/
RUN cd frontend && bun install --ci

# Copy application code
COPY --link . .

# Change to frontend directory and build the frontend app
WORKDIR /app/frontend
RUN bun run build
# Remove all files in frontend except for the dist folder
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "start" ]
