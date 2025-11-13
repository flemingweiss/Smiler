# Vercel Setup - Quick Start 🚀

Your project is now configured for **Vercel** - the easiest deployment option!

---

## ✅ What Changed

### New Files Created
- **`api/waitlist.js`** - Vercel serverless function (automatically becomes `/api/waitlist` endpoint)
- **`vercel.json`** - Optional Vercel configuration
- **`VERCEL_SETUP.md`** - This file!

### Files Updated
- **`src/App.jsx`** - Simplified API endpoint logic for Vercel
- **`.env.production`** - Empty VITE_API_URL (uses same domain)
- **`.gitignore`** - Added `.vercel` folder
- **`DEPLOYMENT.md`** - Complete Vercel deployment guide

### Files Preserved
- **`server/index.js`** - Still works for local development!
- **`nhost/` and `functions/`** - Can be removed or ignored (no longer needed)

---

## 🚀 Deploy in 5 Minutes

### 1. Sign Up for Vercel
Go to [vercel.com](https://vercel.com) and sign up with GitHub (free).

### 2. Import Your Project
- Click "Add New..." → "Project"
- Select your GitHub repository
- Click "Import"

### 3. Configure Environment Variables
Add these in Vercel dashboard before deploying:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://flemingweiss2_db_user:v1xqwRVMB0JwdIJm@waitlist.4atvy7r.mongodb.net/?appName=Waitlist` |
| `RESEND_API_KEY` | `re_yqGKjRGj_Df5fcKCzYwu6WB1KPcSHwXrD` |
| `FROM_EMAIL` | `Smiler <onboarding@resend.dev>` |
| `ADMIN_EMAIL` | `flemingweiss2@gmail.com` |
| `NODE_ENV` | `production` |

### 4. Click "Deploy"
Wait 1-2 minutes. Done! 🎉

Your site will be live at: `https://smiler-xxx.vercel.app`

---

## 💻 Local Development

Nothing changed! Run the same commands:

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

---

## 🔄 Updates

Just push to GitHub - Vercel auto-deploys!

```bash
git add .
git commit -m "Update site"
git push origin master
```

---

## 🎯 Why Vercel?

### ✅ Advantages
- **Zero configuration** - Just works
- **Always-on** - No cold starts or sleep
- **Full-stack** - Frontend + API together
- **Free tier** - 100GB bandwidth, unlimited functions
- **Auto-deploy** - Push to GitHub = instant deploy
- **Fast** - Global edge CDN

### ❌ Nhost Issues (Why We Switched)
- Complex config with multiple required sections
- Had to configure Hasura, Auth, PostgreSQL even though not using them
- Multiple deployment failures due to missing fields
- More complex setup for simple use case

---

## 📁 Project Structure

```
your-project/
├── api/                  # ← Vercel serverless functions
│   └── waitlist.js       # Endpoint: /api/waitlist
├── src/                  # Frontend
│   └── App.jsx
├── server/               # Local dev only
│   └── index.js
├── vercel.json           # Vercel config (optional)
└── package.json
```

**On Vercel:**
- Frontend → Static site on CDN
- `/api/*` → Serverless functions
- `server/` → Not deployed (local dev only)

---

## 🔗 Custom Domain (Optional)

### Option 1: Use Vercel's Free Domain
Just use `https://smiler-xxx.vercel.app` - it's free and works great!

### Option 2: Connect Your IONOS Domain
In Vercel dashboard:
1. Settings → Domains → Add Domain
2. Enter your IONOS domain
3. Add DNS records in IONOS (Vercel will show you what to add)
4. Wait 5-30 minutes for DNS propagation
5. SSL certificate is automatic!

---

## 📊 Monitoring

### View Logs
1. Vercel Dashboard → Your Project
2. Click "Functions" tab
3. Click `/api/waitlist`
4. See real-time execution logs

### View Deployments
1. Click "Deployments" tab
2. See every deployment with logs
3. Can rollback instantly if needed

---

## 🆓 Cost

**Completely FREE for your use case:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited serverless function calls
- ✅ 100 GB-hours function execution
- ✅ Global CDN
- ✅ Auto HTTPS/SSL
- ✅ Always-on (no sleep)

MongoDB Atlas: Free tier (512 MB)
Resend: Free tier (3,000 emails/month)

**Total: $0/month**

---

## ❓ Troubleshooting

### "Environment variable undefined"
→ Add variables in Vercel dashboard under Settings → Environment Variables

### "MongoDB connection failed"
→ In MongoDB Atlas, whitelist all IPs: `0.0.0.0/0`

### "Emails not sending"
→ Check RESEND_API_KEY in Vercel dashboard

### CORS errors
→ Already handled! If you see errors, clear browser cache

---

## 📚 Documentation

- **Full Guide:** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)

---

## ✨ Next Steps

1. **Commit changes** (if not already done):
   ```bash
   git add .
   git commit -m "Switch to Vercel deployment"
   git push origin master
   ```

2. **Deploy to Vercel** following steps above

3. **Test your site** at your Vercel URL

4. **(Optional)** Connect custom domain

---

**You're ready to deploy! This is by far the easiest option.** 🎉
