#!/bin/bash

# JKTagRocket Deployment Script

echo "🚀 JKTagRocket Deployment Script"
echo "=================================="

# Check if static export is requested
if [ "$1" = "static" ]; then
    echo "📦 Building for static export..."
    npm run build:static
    echo "🌐 Starting static server..."
    npm run start:static
else
    echo "🖥️  Building for server-side rendering..."
    npm run build
    echo "🚀 Starting server..."
    npm start
fi 