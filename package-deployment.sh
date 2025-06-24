#!/bin/bash

# GambleCodez Deployment Package Creator
echo "📦 Creating deployment package for GambleCodez..."

# Create deployment directory
DEPLOY_DIR="gamblecodez-deployment"
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copy source files
echo "📂 Copying source files..."
cp -r client $DEPLOY_DIR/
cp -r server $DEPLOY_DIR/
cp -r shared $DEPLOY_DIR/

# Copy configuration files
echo "⚙️ Copying configuration files..."
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp vite.config.ts $DEPLOY_DIR/
cp tailwind.config.ts $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp components.json $DEPLOY_DIR/
cp drizzle.config.ts $DEPLOY_DIR/

# Copy deployment files
echo "🚀 Copying deployment files..."
cp README.md $DEPLOY_DIR/
cp .env.example $DEPLOY_DIR/
cp Dockerfile $DEPLOY_DIR/
cp docker-compose.yml $DEPLOY_DIR/
cp fly.toml $DEPLOY_DIR/
cp nginx.conf $DEPLOY_DIR/
cp deploy.sh $DEPLOY_DIR/
cp init.sql $DEPLOY_DIR/

# Copy .gitignore
cp .gitignore $DEPLOY_DIR/

# Create production .env template
cat > $DEPLOY_DIR/.env << EOF
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# Replit Authentication (Required)
REPLIT_DOMAINS="your-domain.com"
REPL_ID="your-repl-id-from-replit-console"
SESSION_SECRET="$(openssl rand -base64 32)"
ISSUER_URL="https://replit.com/oidc"

# Server Configuration
NODE_ENV="production"
PORT=3000
EOF

# Create archive
echo "📦 Creating deployment archive..."
tar -czf gamblecodez-deployment.tar.gz $DEPLOY_DIR

echo "✅ Deployment package created successfully!"
echo "📁 Package location: gamblecodez-deployment.tar.gz"
echo "📂 Extracted files: $DEPLOY_DIR/"
echo ""
echo "🚀 Upload to your server and run:"
echo "   tar -xzf gamblecodez-deployment.tar.gz"
echo "   cd gamblecodez-deployment"
echo "   ./deploy.sh"