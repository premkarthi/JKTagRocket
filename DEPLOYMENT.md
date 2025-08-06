# JKTagRocket Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended - Full Functionality)
**Cost**: $5-20/month
**Features**: Full Playwright support, automatic HTTPS, easy GitHub integration

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render (Excellent Alternative)
**Cost**: $7-25/month
**Features**: Built-in Playwright support, automatic deployments

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Environment: Node.js

### Option 3: DigitalOcean App Platform
**Cost**: $5-12/month
**Features**: Docker support, reliable infrastructure

1. Connect GitHub repository
2. Use the provided Dockerfile
3. Set resource limits as needed

## 🐳 Docker Deployment

### Full Version (with Playwright)
```bash
# Build and run with full functionality
npm run docker:build
npm run docker:run
```

### Simple Version (without Playwright)
```bash
# Build and run without Playwright (for cPanel)
npm run docker:build-simple
npm run docker:run-simple
```

## 📦 cPanel Deployment (Limited Functionality)

### Prerequisites
- Node.js 18+ support
- SSH access (recommended)

### Steps
1. **Upload files** to your cPanel hosting
2. **Install dependencies**:
   ```bash
   npm install --production
   ```
3. **Build the application**:
   ```bash
   npm run build
   ```
4. **Start the application**:
   ```bash
   npm start
   ```

### Limitations with cPanel
- ❌ No server-side network analysis
- ❌ No Playwright functionality
- ✅ Basic ad preview works
- ✅ Client-side analysis works
- ✅ All other tools work normally

## 🔧 Environment Variables

Create a `.env.local` file for production:

```env
# Google Analytics (replace with your ID)
NEXT_PUBLIC_GA_ID=G-XXXXXXX

# Optional: Custom domain
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📊 Performance Optimization

### For Railway/Render
- Enable automatic scaling
- Set memory limits appropriately
- Use CDN for static assets

### For cPanel
- Enable gzip compression
- Use browser caching
- Optimize images

## 🔒 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit sensitive data
3. **CORS**: Configure CORS for your domain
4. **Rate Limiting**: Implement rate limiting for API endpoints

## 🐛 Troubleshooting

### Docker Build Fails
```bash
# Try the simple Dockerfile
docker build -f Dockerfile.simple -t jktagrocket .
```

### Playwright Issues
```bash
# Install Playwright browsers manually
npx playwright install chromium
```

### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=2048" npm start
```

## 💰 Cost Comparison

| Platform | Monthly Cost | Playwright | Ease of Use | Recommended |
|----------|-------------|------------|-------------|-------------|
| **Railway** | $5-20 | ✅ Full | ⭐⭐⭐⭐⭐ | ✅ Yes |
| **Render** | $7-25 | ✅ Full | ⭐⭐⭐⭐ | ✅ Yes |
| **DigitalOcean** | $5-12 | ✅ Full | ⭐⭐⭐ | ✅ Yes |
| **Vercel** | $20+ | ❌ Limited | ⭐⭐⭐ | ❌ Expensive |
| **cPanel** | $5-15 | ❌ None | ⭐⭐ | ⚠️ Limited |

## 🎯 Recommendation

**For full functionality**: Use **Railway** or **Render**
**For budget hosting**: Use **cPanel** with client-side only features
**For enterprise**: Use **DigitalOcean App Platform**

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Consider using the simple Dockerfile for easier deployment 