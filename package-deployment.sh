#!/bin/bash

# 🎰 GambleCodez - Fly.io Deployment Packager
echo "📦 Creating Fly.io deployment package..."

# Define deployment directory
DEPLOY_DIR="gamblecodez-deployment"
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# 📂 Copy source directories
echo "📂 Copying app source..."
cp -r client $DEPLOY_DIR/
cp -r server $DEPLOY_DIR/
cp -r shared $DEPLOY_DIR/

# ⚙️ Copy core configuration and build files
echo "⚙️ Copying config files..."
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp vite.config.ts $DEPLOY_DIR/
cp tailwind.config.ts $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp components.json $DEPLOY_DIR/
cp drizzle.config.ts $DEPLOY_DIR/

# 🚀 Copy deployment-specific files
echo "🚀 Copying deploy files..."
cp Dockerfile $DEPLOY_DIR/
cp docker-compose.yml $DEPLOY_DIR/
cp fly.toml $DEPLOY_DIR/
cp nginx.conf $DEPLOY_DIR/
cp deploy.sh $DEPLOY_DIR/
cp init.sql $DEPLOY_DIR/
cp README.md $DEPLOY_DIR/

# ⛔ No .env creation — use Fly Secrets
echo "🔐 Skipping .env generation (Fly.io secrets used)"

# 🔥 Archive the deployment
echo "📦 Creating archive..."
tar -czf gamblecodez-deployment.tar.gz $DEPLOY_DIR

# ✅ Done
echo "✅ Deployment package created!"
echo "📁 Archive: gamblecodez-deployment.tar.gz"
echo "📂 Folder:  $DEPLOY_DIR"
echo ""
echo "🚀 To deploy to Fly.io:"
echo "   cd $DEPLOY_DIR"
echo "   flyctl deploy --config fly.toml"
