# Smiler - Vercel Deployment Guide

This guide covers deploying your Smiler waitlist website to **Vercel** - the simplest deployment option!

---

## Why Vercel?

- ✅ **Zero configuration** - No complex config files
- ✅ **Full-stack deployment** - Frontend + API in one place
- ✅ **Auto-deploy from GitHub** - Push to deploy
- ✅ **Always-on** - No cold starts or sleep issues
- ✅ **Free tier** - 100GB bandwidth, unlimited requests
- ✅ **Fast edge network** - Global CDN included

---

## Prerequisites

- [x] Vercel account (free)
- [x] GitHub account
- [x] MongoDB Atlas database configured
- [x] Resend API key for email functionality

---

## Part 1: Deploy to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Import Your Project
1. In Vercel dashboard, click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find your `Smiler` repository
4. Click "Import"

### Step 3: Configure Project Settings
Vercel will auto-detect your framework. Configure these settings:

**Framework Preset:** Vite
**Root Directory:** `./` (leave default)
**Build Command:** `npm run build` (or leave default)
**Output Directory:** `dist` (should auto-detect)
**Install Command:** `npm install` (should auto-detect)

### Step 4: Add Environment Variables
Click "Environment Variables" and add these:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://flemingweiss2_db_user:v1xqwRVMB0JwdIJm@waitlist.4atvy7r.mongodb.net/?appName=Waitlist` |
| `RESEND_API_KEY` | `re_yqGKjRGj_Df5fcKCzYwu6WB1KPcSHwXrD` |
| `FROM_EMAIL` | `Smiler <onboarding@resend.dev>` |
| `ADMIN_EMAIL` | `flemingweiss2@gmail.com` |
| `NODE_ENV` | `production` |

**Note:** For `VITE_API_URL`, leave it empty or set to `/api` - not needed since API is on same domain!

### Step 5: Deploy!
1. Click "Deploy"
2. Wait 1-2 minutes for deployment
3. Vercel will provide you with a URL like: `https://smiler-xxx.vercel.app`

✅ **Done! Your site is live!**

---

## Part 2: Connect Custom Domain (Optional)

If you want to use your IONOS domain:

### Option 1: Point DNS to Vercel
1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Click "Add Domain"
4. Enter your IONOS domain (e.g., `yourdomain.com`)
5. Vercel will show you DNS records to add

6. In IONOS dashboard:
   - Go to Domain settings
   - Add the DNS records Vercel provided (usually A or CNAME records)
   - Wait 5-30 minutes for DNS propagation

7. Vercel will automatically provision SSL certificate

### Option 2: Use Vercel's Free Domain
Just use the `https://smiler-xxx.vercel.app` domain Vercel provides!

---

## Part 3: Test Your Deployment

### Step 1: Visit Your Site
Go to your Vercel URL (e.g., `https://smiler-xxx.vercel.app`)

### Step 2: Test Waitlist Form
1. Enter an email address
2. Submit the form
3. Check for success message
4. Verify confirmation email arrives
5. Check admin notification email

### Step 3: Test Duplicate Prevention
1. Try submitting the same email again
2. Should show: "You're already on the waitlist!"

### Step 4: Check Function Logs
In Vercel dashboard:
1. Go to your project
2. Click "Functions" tab
3. Click on `/api/waitlist`
4. View real-time logs

---

## Local Development

Everything works exactly as before:

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

Your Express server [server/index.js](server/index.js) still works for local development!

---

## Updating Your Deployment

### Automatic Deployment
Just push to GitHub - Vercel auto-deploys!

```bash
git add .
git commit -m "Update website"
git push origin master
```

Vercel will:
1. Detect the push
2. Build your project
3. Deploy automatically
4. Show deployment status in dashboard

### Manual Deployment
In Vercel dashboard:
1. Go to "Deployments" tab
2. Click "Redeploy" on any previous deployment

---

## Project Structure

Your project is now set up for Vercel:

```
your-project/
├── api/                    # Serverless functions
│   └── waitlist.js         # POST /api/waitlist endpoint
├── src/                    # Frontend React code
│   ├── App.jsx
│   └── ...
├── public/                 # Static assets
├── server/                 # Local dev Express server (not deployed)
│   └── index.js
├── vercel.json             # Vercel configuration
├── package.json
└── vite.config.js
```

**What gets deployed:**
- ✅ Frontend (`src/`, `public/`) → Static site
- ✅ API functions (`api/`) → Serverless functions
- ❌ Express server (`server/`) → Only for local dev

---

## Monitoring & Logs

### View Function Logs
1. Go to Vercel dashboard
2. Select your project
3. Click "Functions" → Select function
4. View real-time execution logs

### View Deployment Logs
1. Go to "Deployments" tab
2. Click on any deployment
3. View build and runtime logs

### Analytics
1. Go to "Analytics" tab
2. View page views, function calls, performance metrics

---

## Cost Summary

### Vercel Free Tier (Hobby Plan):
- ✅ **100 GB bandwidth** per month
- ✅ **Unlimited serverless function executions**
- ✅ **100 GB hours** function execution time
- ✅ **Automatic HTTPS** with SSL
- ✅ **Global CDN** included
- ✅ **Always-on** - No cold starts or sleep
- ✅ **1000 GB bandwidth** when using commercial assets

### Other Services:
- **MongoDB Atlas:** Free tier (512 MB storage)
- **Resend:** Free tier (100 emails/day, 3,000/month)

**Total Monthly Cost:** $0 (completely free)

**When to Upgrade ($20/month Pro plan):**
- Need more than 100 GB bandwidth
- Need team collaboration features
- Need password-protected deployments

---

## Troubleshooting

### Issue: "Function execution timeout"
**Solution:** Vercel free tier has 10-second timeout for functions. This should be plenty for email + MongoDB operations. If you hit this limit, upgrade to Pro (60-second timeout).

### Issue: "Environment variable not defined"
**Solution:**
1. Go to Vercel dashboard → Settings → Environment Variables
2. Verify all variables are added
3. Redeploy project after adding variables

### Issue: "MongoDB connection failed"
**Solution:**
1. Check `MONGODB_URI` is correct in Vercel environment variables
2. In MongoDB Atlas, whitelist all IPs: `0.0.0.0/0`
   - Go to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere"

### Issue: "Emails not sending"
**Solution:**
1. Verify `RESEND_API_KEY` in Vercel environment variables
2. Check Resend dashboard for API usage and errors
3. Verify `FROM_EMAIL` domain is verified in Resend

### Issue: CORS errors
**Solution:** The API function already has CORS headers configured. If you still see errors:
1. Clear browser cache
2. Check browser console for specific error message
3. Verify function is deploying correctly in Vercel dashboard

---

## Production Checklist

- [ ] Project deployed to Vercel
- [ ] All environment variables configured
- [ ] Custom domain connected (optional)
- [ ] SSL certificate active (automatic)
- [ ] Waitlist form tested successfully
- [ ] Email delivery confirmed (user + admin)
- [ ] Duplicate email prevention working
- [ ] MongoDB storing entries correctly
- [ ] Function logs showing successful executions

---

## Vercel CLI (Optional)

For advanced users, install Vercel CLI:

```bash
# Install globally
npm install -g vercel

# Login
vercel login

# Deploy from command line
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

## Migration from Other Services

If you were using Nhost or Render before:

### From Nhost:
- ✅ Remove `nhost/` folder and `functions/` folder (no longer needed)
- ✅ API is now in `/api` folder
- ✅ Same environment variables (just copy to Vercel)

### From Render:
- ✅ Keep Express server for local dev
- ✅ Vercel deploys from `/api` folder instead
- ✅ Same environment variables (just copy to Vercel)

---

## Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **MongoDB Atlas:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Resend Docs:** [resend.com/docs](https://resend.com/docs)

---

## Why Vercel is Perfect for This Project

1. **Simplicity** - No config files needed (vercel.json is optional)
2. **Speed** - Global edge network, instant deployments
3. **Always-on** - No cold starts or sleep like Render/Nhost free tiers
4. **Full-stack** - Frontend + API in one deployment
5. **Git integration** - Push to deploy automatically
6. **Generous free tier** - Perfect for waitlist/landing pages

---

## Questions?

If you encounter issues:
1. Check Vercel function logs (Dashboard → Functions → waitlist)
2. Check browser console for frontend errors
3. Verify all environment variables in Vercel
4. Test API directly:
   ```bash
   curl -X POST https://your-site.vercel.app/api/waitlist \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

**Good luck with your deployment! 🚀**

**This is the easiest deployment option - you'll be live in under 5 minutes!**
