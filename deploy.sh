#!/bin/bash

# GambleCodez Deployment Script
echo "🎰 Deploying GambleCodez..."

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 20+ first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version check passed${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp .env.example .env
    echo -e "${RED}Please edit .env file with your configuration before continuing.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --only=production

# Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env || grep -q "DATABASE_URL=\"\"" .env; then
    echo -e "${RED}❌ DATABASE_URL not configured in .env file${NC}"
    exit 1
fi

# Run database migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npm run db:push

echo -e "${GREEN}✅ Database setup complete${NC}"

# Check if PM2 is installed for production
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}🚀 Starting application with PM2...${NC}"
    pm2 stop gamblecodez 2>/dev/null || true
    pm2 delete gamblecodez 2>/dev/null || true
    pm2 start npm --name "gamblecodez" -- start
    pm2 save
    echo -e "${GREEN}✅ Application started with PM2${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 not found. Install with: npm install -g pm2${NC}"
    echo -e "${YELLOW}🚀 Starting application...${NC}"
    npm start &
    echo -e "${GREEN}✅ Application started${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${GREEN}🌐 Application should be running on port 3000${NC}"
echo -e "${GREEN}🔗 Access your admin panel at: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure your reverse proxy (nginx/apache)"
echo "2. Set up SSL certificates"
echo "3. Configure domain in Replit console"
echo "4. Test the application"
echo ""
echo -e "${GREEN}📖 Check README.md for detailed setup instructions${NC}"