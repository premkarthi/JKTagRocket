# 🚀 Railway Deployment Guide for JKTagRocket

This guide ensures your JKTagRocket application deploys with full server-side browser automation support on Railway.

## 🎯 **Problem Solved**

- **Local**: 18 network calls (server-side capture working)
- **Railway**: 3 network calls (client-side fallback due to missing browser automation)

## 📋 **Prerequisites**

1. **Railway CLI** installed:
   ```bash
   npm install -g @railway/cli
   ```

2. **Railway Account** and project created

3. **Git repository** connected to Railway

## 🛠️ **Deployment Steps**

### 1. **Prepare Your Project**

Ensure you have the correct files:
- ✅ `Dockerfile.railway` - Optimized for Railway with browser automation
- ✅ `railway.json` - Points to the correct Dockerfile
- ✅ `app/api/capture/route.js` - Enhanced server-side capture
- ✅ `app/api/health/route.js` - Health check endpoint

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

### 4. **Test Browser Automation**

Visit your health check endpoint:
```
https://your-app.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "browserAutomation": {
    "playwright": "available",
    "puppeteer": "available",
    "chromiumPath": "/usr/bin/chromium-browser"
  }
}
```

## 🔧 **Configuration Files**

### `Dockerfile.railway`
- Alpine Linux with Chromium
- Playwright and Puppeteer support
- Security optimizations
- Non-root user for security

### `railway.json`
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile.railway"
  }
}
```

### Environment Variables (Auto-set)
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser`
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`
- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`

## 🧪 **Testing Your Deployment**

1. **Visit your app**: `https://your-app.railway.app`
2. **Go to Display Ads tool**: `/tools/display-ads`
3. **Paste your ad tag**:
   ```html
   <script type="text/javascript" src="https://jvxas.potterybarnkids.com/unit/unit_renderer.php?es_pId=5b3d4426&isDynamic=1&ap_DataSignal1=$!{DC_DATA_KV:28690741:CatID:9}&ap_DataSignal2=$!{DC_DATA_CAT_ID:1748974483:9}&ap_DataSignal3=$!{LINE_ITEM_ID}&ap_DataSignal4=$!{Package_ID}&ap_DataSignal5=$!{DC_DATA_KV:28690741:Pagetype:5}&ap_DataSignal6=$!{DC_DATA_KV:28690741:ProdCode:9}&ap_DataSignal7=$!{DC_DATA_KV:28690741:SiteCat:9}&ap_DataSignal8=$!{DC_DATA_KV:28690741:SuperCat:9}&ap_DataSignal9=$!{DC_DATA_KV:28690741:TopCat:2}&ap_DataSignal10=$!{DC_DATA_KV:28690741:CatID:9}&ap_DataSignal11=$!{DC_DATA_CAT_ID:1749815371:9}&ap_DataSignal16=$!{AD_CALL_ID}&c_adcall_id=$!{AD_CALL_ID}&c_cogs=$!{COGS}&c_ifa=$!{IFA}&c_inventory_source_id=$!{INVENTORY_SOURCE_ID}&c_publisher_id=$!{PUBLISHER_ID}&c_site_url=$!{SITE_URL}&campaignId=165047&ts_pId=5b3d4426&siteId=721ea4b819c34c0&dspId=DBM&bDim=728x90&creativeUnitType=18&jvxVer=2&bUnitId=1800&us_privacy=${US_PRIVACY}&gdpr_consent=${GDPR_CONSENT_294}&gdpr=${GDPR}&r=$!{AD_CALL_ID}&cMacro=[INSERT_CLICK_MACRO]&ap_cookieData_type=pbk&wl=1"></script>
   ```
4. **Enable "Deep capture"** and click "Submit Tag"
5. **Expected result**: 18+ network calls (server-side capture)

## 🐛 **Troubleshooting**

### Issue: Still getting client-side capture
**Solution**: Check Railway logs for browser automation errors:
```bash
railway logs
```

### Issue: Browser automation not available
**Solution**: Verify health check endpoint shows:
```json
{
  "browserAutomation": {
    "playwright": "available",
    "puppeteer": "available"
  }
}
```

### Issue: Deployment fails
**Solution**: Check if Railway has enough resources:
- Upgrade to a plan with more memory/CPU
- Check build logs for dependency issues

### Issue: Timeout errors
**Solution**: The timeout has been increased to 8 seconds for Railway. If still failing:
- Check network connectivity
- Verify the ad tag is valid

## 📊 **Expected Results**

After successful deployment:
- ✅ **Source**: "server-side" or "server-side-puppeteer"
- ✅ **Network calls**: 18+ (same as local)
- ✅ **Timeline data**: Proper waterfall chart
- ✅ **Performance**: Fast analysis with loading indicators

## 🔄 **Redeployment**

To update your deployment:
```bash
git add .
git commit -m "Update deployment configuration"
railway up
```

## 📞 **Support**

If you're still experiencing issues:
1. Check Railway logs: `railway logs`
2. Test health endpoint: `/api/health`
3. Verify browser automation status in health response
4. Check if the ad tag works locally first

---

**Success Criteria**: Your Railway deployment should now capture 18+ network calls just like your local environment! 🎉 