#!/bin/bash

# Railway Deployment Script for JKTagRocket
# This script ensures proper deployment with browser automation support

echo "🚀 Starting Railway deployment for JKTagRocket..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if we're logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    echo "railway login"
    exit 1
fi

echo "📦 Building and deploying with browser automation support..."

# Deploy to Railway
railway up

echo "✅ Deployment complete!"
echo ""
echo "🔍 To monitor the deployment:"
echo "railway logs"
echo ""
echo "🌐 To open the deployed app:"
echo "railway open"
echo ""
echo "📊 To check deployment status:"
echo "railway status" 