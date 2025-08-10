# 🚀 Railway Free Tier Deployment Guide

This guide helps you deploy JKTagRocket on Railway's **free tier** while working within the 4GB image size limit.

## 🎯 **Free Tier Limitations & Solutions**

### ❌ **Limitations**
- **Image size limit**: 4GB maximum
- **No server-side browser automation** (Playwright/Puppeteer too large)
- **Client-side analysis only** (3-5 network calls vs 18+ locally)

### ✅ **Solutions**
- **Lightweight Dockerfile** (`Dockerfile.railway-minimal`)
- **Production-optimized dependencies** (`package.prod.json`)
- **Graceful fallback** to client-side analysis
- **Enhanced client-side capture** for better results

## 📋 **Prerequisites**

1. **Railway CLI** installed:
   ```bash
   npm install -g @railway/cli
   ```

2. **Railway Account** (free tier)

3. **Git repository** connected to Railway

## 🛠️ **Deployment Steps**

### 1. **Prepare Your Project**

Ensure you have the correct files:
- ✅ `Dockerfile.railway-minimal` - Lightweight for free tier
- ✅ `package.prod.json` - Production dependencies only
- ✅ `railway.json` - Points to minimal Dockerfile
- ✅ `app/api/capture/route.js` - Graceful fallback handling

### 2. **Deploy to Railway**

```bash
# Option 1: Use the deployment script
chmod +x deploy-railway.sh
./deploy-railway.sh

# Option 2: Manual deployment
railway login
railway up
```

### 3. **Verify Deployment**

```bash
# Check deployment status
railway status

# View logs
railway logs

# Open the app
railway open
```

### 4. **Test Functionality**

Visit your health check endpoint:
```
https://your-app.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "browserAutomation": {
    "playwright": "unavailable",
    "puppeteer": "unavailable"
  },
  "message": "Free tier deployment - client-side analysis only"
}
```

## 🔧 **Configuration Files**

### `Dockerfile.railway-minimal`
- **Alpine Linux** (smallest base image)
- **Production dependencies only**
- **No browser automation** (saves ~2GB)
- **Optimized for free tier**

### `package.prod.json`
- **Essential dependencies only**
- **No dev dependencies** (Playwright/Puppeteer)
- **Minimal footprint**

### `railway.json`
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile.railway-minimal"
  }
}
```

## 🧪 **Testing Your Deployment**

1. **Visit your app**: `https://your-app.railway.app`
2. **Go to Display Ads tool**: `/tools/display-ads`
3. **Paste your ad tag**:
   ```html
   <script type="text/javascript" src="https://jvxas.potterybarnkids.com/unit/unit_renderer.php?es_pId=5b3d4426&isDynamic=1&ap_DataSignal1=$!{DC_DATA_KV:28690741:CatID:9}&ap_DataSignal2=$!{DC_DATA_CAT_ID:1748974483:9}&ap_DataSignal3=$!{LINE_ITEM_ID}&ap_DataSignal4=$!{Package_ID}&ap_DataSignal5=$!{DC_DATA_KV:28690741:Pagetype:5}&ap_DataSignal6=$!{DC_DATA_KV:28690741:ProdCode:9}&ap_DataSignal7=$!{DC_DATA_KV:28690741:SiteCat:9}&ap_DataSignal8=$!{DC_DATA_KV:28690741:SuperCat:9}&ap_DataSignal9=$!{DC_DATA_KV:28690741:TopCat:2}&ap_DataSignal10=$!{DC_DATA_KV:28690741:CatID:9}&ap_DataSignal11=$!{DC_DATA_CAT_ID:1749815371:9}&ap_DataSignal16=$!{AD_CALL_ID}&c_adcall_id=$!{AD_CALL_ID}&c_cogs=$!{COGS}&c_ifa=$!{IFA}&c_inventory_source_id=$!{INVENTORY_SOURCE_ID}&c_publisher_id=$!{PUBLISHER_ID}&c_site_url=$!{SITE_URL}&campaignId=165047&ts_pId=5b3d4426&siteId=721ea4b819c34c0&dspId=DBM&bDim=728x90&creativeUnitType=18&jvxVer=2&bUnitId=1800&us_privacy=${US_PRIVACY}&gdpr_consent=${GDPR_CONSENT_294}&gdpr=${GDPR}&r=$!{AD_CALL_ID}&cMacro=[INSERT_CLICK_MACRO]&ap_cookieData_type=pbk&wl=1"></script>
   ```
4. **Disable "Deep capture"** (not available in free tier)
5. **Expected result**: 3-5 network calls (client-side analysis)

## 📊 **Expected Results (Free Tier)**

- ✅ **Source**: "client-side" or "client-side-error"
- ✅ **Network calls**: 3-5 (limited by CORS)
- ✅ **Timeline data**: Basic waterfall chart
- ✅ **Performance**: Fast analysis with loading indicators
- ✅ **Cost**: $0/month

## 🔄 **Upgrading to Paid Tier**

If you need full server-side analysis (18+ network calls):

1. **Upgrade Railway plan** ($5-20/month)
2. **Switch to full Dockerfile**:
   ```json
   {
     "dockerfilePath": "Dockerfile.railway-alt"
   }
   ```
3. **Redeploy**: `railway up`

## 🐛 **Troubleshooting**

### Issue: Build fails with size limit
**Solution**: Ensure you're using `Dockerfile.railway-minimal` and `package.prod.json`

### Issue: Still getting build errors
**Solution**: Check if you have unnecessary files in your repository:
```bash
# Remove unnecessary files
rm -rf node_modules
rm -rf .next
rm -rf .git
```

### Issue: Client-side analysis not working
**Solution**: 
- Check browser console for CORS errors
- Ensure the ad tag is valid
- Try different ad tags

### Issue: Deployment fails
**Solution**: Check Railway logs:
```bash
railway logs
```

## 💡 **Optimization Tips**

### Reduce Image Size
1. **Use Alpine Linux** (smaller than Ubuntu)
2. **Install only production dependencies**
3. **Remove unnecessary files**
4. **Use multi-stage builds**

### Improve Client-Side Analysis
1. **Enable CORS headers** in ad responses
2. **Use same-origin requests** when possible
3. **Implement better error handling**

## 📞 **Support**

If you're experiencing issues:
1. Check Railway logs: `railway logs`
2. Test health endpoint: `/api/health`
3. Verify the ad tag works locally first
4. Consider upgrading to paid tier for full functionality

---

**Success Criteria**: Your Railway deployment should work within the free tier limits, providing basic network analysis functionality! 🎉

**Note**: For full server-side analysis (18+ network calls), you'll need to upgrade to a paid Railway plan. 