# 🚀 Quick Deploy to Netlify

## In 3 Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### Step 2: Connect Repository to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"**
4. Select your **namibrapay-lpg** repository

### Step 3: Deploy

Netlify auto-detects Next.js settings:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 20

Click **"Deploy site"** and you're done! ✨

Your site will be live at: `https://your-site-name.netlify.app`

---

## Custom Domain (Optional)

After deployment:
1. **Netlify:** Domain settings → Add custom domain
2. **DNS:** Add CNAME record pointing to Netlify
3. **SSL:** Automatic!

---

## Environment Variables

If you need env vars:
1. Site settings → Environment variables
2. Add variables (prefix public ones with `NEXT_PUBLIC_`)
3. Redeploy

---

## Auto-Deploys

Every push to `main` automatically deploys! 🎉

---

## Need Help?

📖 **Full Guide:** `NETLIFY-DEPLOYMENT.md`  
📖 **Coolify Alternative:** `COOLIFY-DEPLOYMENT.md`

---

## After Deployment

Your app will have:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deployments on push
- ✅ Preview deployments for PRs
- ✅ One-click rollbacks

Enjoy! 🎉
