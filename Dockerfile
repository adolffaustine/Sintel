# ── Stage 1: Build the React client ──────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app/client

# Install client dependencies
COPY client/package*.json ./
RUN npm ci

# Copy source and build
COPY client/ ./
RUN npm run build

# ── Stage 2: Production server ─────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install server dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server
COPY server.js ./

# Copy built React assets from stage 1
COPY --from=build /app/client/dist ./client/dist

# Expose the port Express listens on
EXPOSE 4031

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:4031/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
