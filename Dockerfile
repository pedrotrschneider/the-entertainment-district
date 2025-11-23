# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - use Node.js instead of nginx
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy server file
COPY server.js ./

# Expose port 80
EXPOSE 80

# Environment variables will be provided at runtime via .env file
# Default values (override these with --env-file .env or docker-compose)
ENV PORT=80

# Start the server
CMD ["npm", "start"]
