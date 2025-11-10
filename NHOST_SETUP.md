# Nhost.io Setup - Quick Start Guide

Your project has been adapted for deployment to **nhost.io** with serverless functions!

---

## What Changed?

### ✅ New Files Created

1. **`functions/waitlist.js`**
   - Converted your Express server endpoint to nhost serverless function
   - Handles waitlist signup with MongoDB and Resend email
   - Automatically deployed when you push to GitHub

2. **`nhost/nhost.toml`**
   - Configuration file with environment variables
   - Defines Node.js version and project settings

3. **`.nhostignore`**
   - Excludes unnecessary files from nhost deployment
   - Keeps deployment lightweight and fast

4. **`functions/README.md`**
   - Documentation for serverless functions
   - Explains endpoints and local testing

### ✅ Files Updated

1. **`src/App.jsx`** (Line 65-67)
   - Added smart endpoint detection
   - Uses `/waitlist` for nhost, `/api/waitlist` for local dev
   - No breaking changes to local development

2. **`.env.production`**
   - Updated with nhost URL format
   - Ready for your nhost project URL

3. **`DEPLOYMENT.md`**
   - Complete nhost.io deployment guide
   - Step-by-step instructions for IONOS + nhost setup

### ✅ Files Preserved

- **`server/index.js`** - Still works for local development!
- **All other files** - No changes to frontend or styling

---

## Quick Start

### 1. Sign up for Nhost
```
https://nhost.io
```
- Free tier available
- No credit card required
- Sign up with GitHub for easy deployment

### 2. Create New Project
- Project name: `smiler-backend` (or your choice)
- Select region: Choose closest to your users
- Tier: Free

### 3. Connect GitHub Repository
In Nhost dashboard:
- Settings → Git → Connect Repository
- Select your repo and branch

### 4. Configure Environment Variables
**CRITICAL:** Add environment variables through the Dashboard UI, NOT in `nhost.toml`

In Nhost dashboard: Settings → Environment Variables

Click "Add Variable" for each:
- `MONGODB_URI` = `mongodb+srv://flemingweiss2_db_user:v1xqwRVMB0JwdIJm@waitlist.4atvy7r.mongodb.net/?appName=Waitlist`
- `RESEND_API_KEY` = `re_yqGKjRGj_Df5fcKCzYwu6WB1KPcSHwXrD`
- `FROM_EMAIL` = `Smiler <onboarding@resend.dev>`
- `ADMIN_EMAIL` = `flemingweiss2@gmail.com`
- `FRONTEND_URL` = `https://yourdomain.com`
- `NODE_ENV` = `production`

**Detailed guide:** See [NHOST_ENV_SETUP.md](NHOST_ENV_SETUP.md)

### 5. Push to GitHub
```bash
git add .
git commit -m "Add nhost serverless functions"
git push origin main
```

Nhost auto-deploys! 🚀

### 6. Get Your Backend URL
After deployment completes:
```
https://your-project-name.nhost.run/v1/functions/waitlist
```

### 7. Update Frontend Configuration
Edit `.env.production`:
```bash
VITE_API_URL=https://your-project-name.nhost.run/v1/functions
```

### 8. Build & Deploy Frontend to IONOS
```bash
npm run build:frontend
```

Upload `dist/` contents to your IONOS hosting via FTP.

---

## Local Development

### Option 1: Use Original Express Server (Recommended)
```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

Everything works exactly as before! The frontend automatically uses `/api/waitlist` for local dev.

### Option 2: Test with Nhost CLI
```bash
# Install Nhost CLI globally
npm install -g nhost

# Start local nhost environment
nhost up

# Functions available at:
# http://localhost:1337/v1/functions/waitlist
```

---

## Testing Your Deployment

### Test Backend Endpoint Directly
```bash
curl -X POST https://your-project.nhost.run/v1/functions/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Successfully joined the waitlist! Check your email for confirmation."
}
```

### Test from Browser Console
```javascript
fetch('https://your-project.nhost.run/v1/functions/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
}).then(r => r.json()).then(console.log)
```

---

## Key Differences: Nhost vs Express

| Aspect | Express (server/index.js) | Nhost (functions/waitlist.js) |
|--------|---------------------------|-------------------------------|
| **Type** | Long-running server | Serverless function |
| **Endpoint** | `/api/waitlist` | `/v1/functions/waitlist` |
| **Deployment** | Manual (Render, VPS) | Auto-deploy from GitHub |
| **Scaling** | Manual | Automatic |
| **Cost** | Always running | Pay per execution |
| **Cold Starts** | None | 2-3 seconds first request |
| **Local Dev** | `npm run dev:backend` | `nhost up` or Express |

---

## Monitoring & Logs

### View Function Logs
1. Go to Nhost dashboard
2. Navigate to "Logs" tab
3. Filter by "Functions"
4. Monitor real-time execution logs

### What to Look For
- ✅ Function execution started
- ✅ MongoDB connected successfully
- ✅ Email saved to database
- ✅ Emails sent via Resend
- ❌ Any error messages

---

## Cost Breakdown

### Free Tier Includes:
- ✅ 1 project
- ✅ 1 GB-hour function execution/month
- ✅ Serverless functions
- ✅ Auto-deploy from GitHub
- ✅ SSL certificate included

### Limitations:
- ⚠️ Projects pause after 7 days inactivity
- ⚠️ Cold starts (2-3 seconds)
- ⚠️ 1 project maximum

### When to Upgrade ($15/month):
- Need multiple projects
- Need always-on availability
- Want faster cold starts
- Higher execution limits

---

## Troubleshooting

### Issue: "Functions not found"
**Solution:** Make sure `functions/` folder is in your repo root and pushed to GitHub.

### Issue: "Environment variable undefined"
**Solution:** Check nhost dashboard → Settings → Environment Variables. Re-deploy after adding variables.

### Issue: "MongoDB connection failed"
**Solution:** Verify `MONGODB_URI` is correct in nhost environment variables. Check MongoDB Atlas whitelist (allow all IPs: `0.0.0.0/0`).

### Issue: "Cold start too slow"
**Note:** First request after inactivity takes 2-3 seconds. This is normal for serverless functions. Subsequent requests are under 1 second.

---

## Need Help?

1. **Full Deployment Guide:** See [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Nhost Docs:** [docs.nhost.io](https://docs.nhost.io)
3. **Nhost Discord:** [discord.gg/9V7Qb2U](https://discord.gg/9V7Qb2U)

---

## Next Steps

1. ✅ Create nhost account
2. ✅ Create project and connect GitHub
3. ✅ Configure environment variables
4. ✅ Push code to deploy backend
5. ✅ Update `.env.production` with nhost URL
6. ✅ Build frontend
7. ✅ Deploy frontend to IONOS
8. ✅ Test end-to-end

**You're ready to deploy! 🚀**
