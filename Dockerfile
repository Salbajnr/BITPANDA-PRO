# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY server/package.json ./server/

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder
WORKDIR /app
COPY --from=builder /app/server/ .

# Ensure node_modules is properly set up
RUN npm ci --only=production

# Set environment to production
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "--experimental-specifier-resolution=node", "--no-warnings", "index.js"]
