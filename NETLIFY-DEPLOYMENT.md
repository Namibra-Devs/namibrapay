# 🚀 Deploying NamibraPay to Netlify

## ✅ Configuration Complete

Your project is ready for Netlify deployment with:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `next.config.ts` - Optimized for Netlify
- ✅ All dynamic routes working
- ✅ Automatic Next.js plugin

## Quick Deploy (3 Steps)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### Step 2: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"** (authorize if first time)
4. Select your **namibrapay-lpg** repository

### Step 3: Configure Build Settings

Netlify will auto-detect Next.js, but verify:

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 20 (set in netlify.toml)

**Environment Variables** (if needed):
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=your-api-url
```

Click **"Deploy site"** and you're done! 🎉

---

## What Netlify Does Automatically

- ✅ Installs dependencies (`npm install`)
- ✅ Builds your Next.js app (`npm run build`)
- ✅ Deploys to global CDN
- ✅ Provides HTTPS certificate
- ✅ Creates preview deployments for PRs
- ✅ Auto-deploys on every push to main

---

## Custom Domain Setup

### After First Deployment:

1. **In Netlify Dashboard:**
   - Go to **"Domain settings"**
   - Click **"Add custom domain"**
   - Enter: `pay.namibra.com` or your domain

2. **In Your DNS Provider (Cloudflare, etc.):**
   
   **Option A: Using A Record**
   ```
   Type: A
   Name: pay (or @)
   Value: 75.2.60.5 (Netlify load balancer)
   ```

   **Option B: Using CNAME (Recommended)**
   ```
   Type: CNAME
   Name: pay (or www)
   Value: your-site-name.netlify.app
   ```

3. **Enable HTTPS** (automatic after DNS propagation)

---

## Environment Variables

### Add in Netlify Dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add your variables:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Important:** Prefix client-side vars with `NEXT_PUBLIC_`

---

## Features Included

### Automatic Deployments
- Every push to `main` triggers deployment
- Pull requests get preview URLs
- Rollback to any previous deploy in 1 click

### Performance
- Global CDN (faster worldwide)
- Automatic image optimization
- Edge functions for dynamic content
- Brotli compression

### Security
- Automatic HTTPS/SSL
- Security headers configured
- DDoS protection
- Private environment variables

---

## Build & Deploy Settings

Your `netlify.toml` configures:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

**Cache Control:**
- Static assets: 1 year cache
- Dynamic pages: Smart cache invalidation

---

## Preview Deployments

For every Pull Request:
1. Netlify creates a preview URL
2. Test changes before merging
3. Share with team for review
4. Automatic cleanup after merge

---

## Monitoring & Analytics

### Built-in Features:
- **Analytics:** Traffic, page views, bandwidth
- **Logs:** Build logs and function logs
- **Forms:** Contact form handling (if needed)
- **Split Testing:** A/B testing capability

### Access Logs:
1. Go to **Deploys** in Netlify dashboard
2. Click on any deploy
3. View build logs and deploy details

---

## Troubleshooting

### Build Fails

**Check build logs:**
1. Netlify Dashboard → Deploys
2. Click failed deploy
3. View detailed logs

**Common fixes:**
```bash
# Clear Netlify cache and redeploy
# (Button in deploy settings)

# Or add to netlify.toml:
[build]
  ignore = "git diff --quiet HEAD^ HEAD"
```

### Environment Variables Not Working

- Prefix client variables with `NEXT_PUBLIC_`
- Redeploy after adding/changing env vars
- Check variable names for typos

### Images Not Loading

- Ensure images are in `public/` folder
- Use absolute paths: `/image.png`
- Check Netlify image optimization settings

### 404 Errors on Routes

- Check `netlify.toml` redirects
- Verify dynamic routes work locally
- Clear deploy cache and retry

---

## Performance Optimization

### 1. Edge Functions (Optional)
For API routes or server-side logic:
```javascript
// netlify/edge-functions/hello.ts
export default async () => {
  return new Response("Hello from the edge!");
};
```

### 2. Image Optimization
Already enabled via Next.js Image component

### 3. Caching Strategy
Configured in `netlify.toml` for optimal performance

---

## Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] `.env.local` in `.gitignore` (not pushed)
- [ ] Environment variables added in Netlify
- [ ] Custom domain configured (optional)
- [ ] Build tested locally: `npm run build`

After deployment:
- [ ] Site accessible via Netlify URL
- [ ] Custom domain working (if configured)
- [ ] HTTPS active
- [ ] All routes working
- [ ] Images loading correctly
- [ ] No console errors

---

## Continuous Deployment

### Auto-Deploy Setup:
1. **Already configured!** Every push to `main` auto-deploys
2. **Branch deploys:** Configure in Netlify settings
3. **Deploy hooks:** Trigger deploys via API/webhook

### Deploy from CLI (Optional):
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy manually
netlify deploy --prod
```

---

## Cost

**Free Tier Includes:**
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Automatic HTTPS
- Deploy previews

**More than enough for most projects!**

---

## Rollback

If something breaks:
1. Go to **Deploys** in Netlify
2. Find previous working deploy
3. Click **"Publish deploy"**
4. Instant rollback! ⚡

---

## Support & Resources

- **Netlify Docs:** https://docs.netlify.com
- **Next.js on Netlify:** https://docs.netlify.com/integrations/frameworks/next-js/
- **Status Page:** https://www.netlifystatus.com/

---

## 🎉 Success!

Once deployed, your app will be live at:
- `https://your-site-name.netlify.app`
- Or your custom domain

With:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Auto-deploys on push
- ✅ Preview deployments
- ✅ Instant rollbacks

Enjoy your deployed app! 🚀
