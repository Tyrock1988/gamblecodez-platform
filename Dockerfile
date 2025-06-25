# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy only built code from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]
