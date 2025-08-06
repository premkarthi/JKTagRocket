#!/bin/bash

# Railway Deployment Script for JKTagRocket

echo "🚀 Deploying to Railway..."
echo "============================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Initialize Railway project if not already done
if [ ! -f "railway.json" ]; then
    echo "📝 Creating Railway configuration..."
    echo '{
      "$schema": "https://railway.app/railway.schema.json",
      "build": {
        "builder": "DOCKERFILE",
        "dockerfilePath": "Dockerfile"
      },
      "deploy": {
        "startCommand": "npm start",
        "healthcheckPath": "/",
        "healthcheckTimeout": 300,
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
      }
    }' > railway.json
fi

# Deploy to Railway
echo "🚀 Deploying application..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at the Railway URL"
echo "📊 Check Railway dashboard for logs and status" 