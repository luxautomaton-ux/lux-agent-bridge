# Lux Agent Bridge - Dockerfile
# Multi-stage build for production

FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Production image
FROM node:18-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1000 -S luxagent && \
    adduser -u 1000 -S luxagent -G luxagent

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create required directories
RUN mkdir -p logs memory tasks projects runs playbooks && \
    chown -R luxagent:luxagent /app

# Switch to non-root user
USER luxagent

# Expose port
EXPOSE 8787

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:8787/api/health || exit 1

# Run
CMD ["npm", "start"]