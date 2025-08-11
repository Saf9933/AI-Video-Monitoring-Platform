# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript to dist/
RUN npm run build

# Production stage
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy compiled JavaScript from build stage
COPY --from=builder /app/dist ./dist

EXPOSE 8000

USER node

CMD ["node", "dist/index.js"]