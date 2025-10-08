# Vercel Deployment Guide

## Quick Deploy (Recommended - Easiest Method)

### Option 1: Deploy via GitHub Integration (No CLI needed)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/
   - Sign in with GitHub

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `AlanSinclair-spec/Bitcoin-Study-Website-`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** (if any)
   - No environment variables needed for this project currently

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://your-project-name.vercel.app`

✅ **Benefits of GitHub Integration:**
- Auto-deploys on every push to `main` branch
- Preview deployments for pull requests
- No CLI authentication needed
- Easy rollbacks from dashboard

---

## Option 2: Deploy via Vercel CLI

### Step 1: Login to Vercel
```bash
npx vercel login
```
- Follow the prompts to authenticate
- Choose your preferred method (GitHub, GitLab, Bitbucket, Email)

### Step 2: Link Project
```bash
npx vercel link
```
- Answer the prompts:
  - Set up and deploy? **Yes**
  - Which scope? Select your account
  - Link to existing project? **No** (first time)
  - What's your project's name? `softwar-learning-platform` (or your choice)
  - In which directory is your code located? `./`

### Step 3: Deploy to Production
```bash
npx vercel --prod
```
- Builds and deploys to production
- Returns live URL when complete

---

## Current Status

✅ **Git Status**: Up to date
- Latest commit: `00cdffe` (localStorage error handling + documentation)
- Pushed to: `https://github.com/AlanSinclair-spec/Bitcoin-Study-Website-.git`

⏳ **Vercel Status**: Not yet configured
- No `.vercel/project.json` found
- CLI token needs refresh

---

## What to Do Next

### Recommended: Use GitHub Integration (5 minutes)

1. Open browser: https://vercel.com/new
2. Import `AlanSinclair-spec/Bitcoin-Study-Website-`
3. Click "Deploy"
4. Done! Get your live URL

### Alternative: Use CLI (10 minutes)

1. Run: `npx vercel login`
2. Authenticate via browser
3. Run: `npx vercel --prod`
4. Confirm settings
5. Get live URL

---

## After Deployment

### 1. Get Your Live URL
After deployment completes, you'll receive a URL like:
```
https://softwar-learning-platform.vercel.app
```

### 2. Test the Live Site
Run through quick checks:
- [ ] Homepage loads with premium design
- [ ] Navigation works
- [ ] Lessons load correctly
- [ ] Flashcards work
- [ ] No console errors

### 3. Set Up Custom Domain (Optional)
If you have a domain:
- Go to Vercel Dashboard → Your Project → Settings → Domains
- Add your domain (e.g., `softwar.academy`)
- Follow DNS configuration instructions

---

## Vercel Build Settings

### Framework: Next.js 15.5.4

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

**Node Version:**
```
20.x (auto-detected from package.json engines field if set)
```

### Environment Variables
Currently no environment variables needed. If you add any in the future:
- Add to Vercel Dashboard → Project → Settings → Environment Variables
- Or use `.env.local` (not committed to git)

---

## Troubleshooting

### Issue: Build fails on Vercel
**Check:**
```bash
# Run build locally first
npm run build

# If it fails, fix errors before deploying
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### Issue: Deployment succeeds but site shows 404
**Check:**
- Vercel is pointing to correct GitHub branch (`main`)
- Root directory is set to `./`
- No custom rewrites interfering

### Issue: localStorage errors on production
**Status:** ✅ Fixed in latest commit
- Error handling implemented in `lib/progress/storage.ts` and `lib/journal/storage.ts`

---

## Automatic Deployments

Once GitHub integration is set up:

### Production Deployments
- Every push to `main` → Deploys to production
- URL: `https://your-project-name.vercel.app`

### Preview Deployments
- Every push to other branches → Deploys to preview URL
- URL: `https://your-project-name-git-branch-name.vercel.app`
- Perfect for testing before merging

### Pull Request Previews
- Every PR gets its own preview deployment
- Comment on PR shows preview URL
- Great for code reviews

---

## Deployment Checklist

Before deploying to production:
- [x] All code committed and pushed to GitHub
- [x] localStorage error handling implemented
- [x] Premium UI design complete
- [x] Local build succeeds (`npm run build`)
- [ ] Test on Vercel preview first (optional but recommended)
- [ ] Monitor deployment logs for errors
- [ ] Test live site after deployment

---

## Performance on Vercel

**Expected Performance:**
- **Build Time**: 2-3 minutes
- **Cold Start**: < 1 second
- **Page Load**: < 2 seconds (with caching)
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

**Optimizations Applied:**
- Next.js automatic code splitting
- Static page generation where possible
- Optimized images (if using next/image)
- Minimal JavaScript bundles

---

## Monitoring & Analytics

### Vercel Analytics (Optional)
To enable:
1. Go to Vercel Dashboard → Your Project → Analytics
2. Enable Analytics
3. View real-time traffic, page views, and performance

### Web Vitals
Vercel automatically tracks:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **TTFB** (Time to First Byte)

---

## Cost

**Free Tier Includes:**
- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS
- Global CDN
- Preview deployments
- Analytics (limited)

**This project should stay within free tier** unless you get massive traffic (100k+ monthly visitors).

---

## Commands Reference

```bash
# Login to Vercel
npx vercel login

# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod

# Check deployment status
npx vercel ls

# View deployment logs
npx vercel logs [deployment-url]

# Remove a deployment
npx vercel rm [deployment-name]

# Pull environment variables
npx vercel env pull

# Check Vercel CLI version
npx vercel --version
```

---

## Next Steps After Deployment

1. **Share the URL** - Send to stakeholders, testers
2. **Monitor Errors** - Check Vercel logs for runtime errors
3. **Run Tests** - Use TESTING_CHECKLIST.md on live site
4. **Cursor Polish** - Use Cursor to fix issues found on live site
5. **Custom Domain** - Add if you have one
6. **SEO** - Submit to Google Search Console
7. **Analytics** - Set up tracking (Vercel Analytics or Google Analytics)

---

**Ready to deploy!** Choose your method above and let's get this live! 🚀
