# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install root dependencies
RUN npm install

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Install client dependencies and build
WORKDIR /app/client
RUN npm install && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server/ /app/
COPY --from=builder /app/client/dist /app/client/dist

# Set environment to production
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "--experimental-specifier-resolution=node", "--no-warnings", "index.js"]
