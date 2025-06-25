#!/bin/bash

# 🎰 GambleCodez Fly.io Deployment Script
echo "🚀 Deploying GambleCodez to Fly.io..."

# Exit on any error
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ✅ Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Install Node.js 20+ before deploying.${NC}"
    exit 1
fi

# ✅ Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js version 18+ is required. Found: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version $(node -v) OK${NC}"

# ✅ Install dependencies
echo -e "${YELLOW}📦 Installing production dependencies...${NC}"
npm ci --only=production

# ✅ Build app
echo -e "${YELLOW}🔨 Building the application...${NC}"
npm run build

# ✅ Run DB migrations if Drizzle is used
echo -e "${YELLOW}🗃️  Running database migrations...${NC}"
npm run db:push || {
    echo -e "${RED}❌ Drizzle migration failed. Check database config.${NC}"
    exit 1
}

echo -e "${GREEN}✅ DB migration complete${NC}"

# ✅ Deploy to Fly
echo -e "${YELLOW}✈️ Deploying via Fly.io...${NC}"
flyctl deploy --config fly.toml || {
    echo -e "${RED}❌ Fly.io deployment failed.${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}🎉 Fly.io deployment successful!${NC}"
echo -e "${GREEN}🔗 App live at: https://$(grep -m1 'app =' fly.toml | awk '{print $3}' | tr -d '"' ).fly.dev${NC}"
echo ""
