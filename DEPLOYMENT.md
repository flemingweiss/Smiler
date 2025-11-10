# Smiler - IONOS Deployment Guide

This guide covers deploying your Smiler waitlist website using **Option 2: Split Deployment**
- Frontend: IONOS Web Hosting
- Backend: Nhost.io (Serverless Functions)

---

## Prerequisites

- [x] IONOS account with domain registered
- [x] MongoDB Atlas account with database configured
- [x] Resend API key for email functionality
- [ ] Nhost account (for backend hosting)
- [ ] Git repository (for backend deployment)

---

## Part 1: Deploy Backend to Nhost.io

### Step 1: Create Nhost Account
1. Go to [nhost.io](https://nhost.io)
2. Sign up with GitHub (recommended for easy deployment)
3. No credit card required for free tier

### Step 2: Create New Nhost Project
1. In Nhost dashboard, click "Create Project"
2. Choose a project name (e.g., `smiler-backend`)
3. Select a region closest to your users
4. Choose **Free Tier**
5. Click "Create Project"

### Step 3: Connect Your GitHub Repository
1. In your Nhost project dashboard, go to "Settings"
2. Navigate to "Git" tab
3. Click "Connect Repository"
4. Select your GitHub repository
5. Choose the branch to deploy from (usually `main`)
6. Set root directory to `/` (default)

### Step 4: Configure Environment Variables
In Nhost dashboard, go to "Settings" → "Environment Variables"

Add these variables:

```
MONGODB_URI=mongodb+srv://flemingweiss2_db_user:v1xqwRVMB0JwdIJm@waitlist.4atvy7r.mongodb.net/?appName=Waitlist
RESEND_API_KEY=re_yqGKjRGj_Df5fcKCzYwu6WB1KPcSHwXrD
FROM_EMAIL=Smiler <onboarding@resend.dev>
ADMIN_EMAIL=flemingweiss2@gmail.com
FRONTEND_URL=https://yourdomain.com
```

**IMPORTANT:** Replace `https://yourdomain.com` with your actual IONOS domain!

### Step 5: Push Your Code to GitHub
If not already done, push your project to GitHub:

```bash
git add .
git commit -m "Add nhost serverless functions"
git push origin main
```

Nhost will automatically detect the changes and deploy!

### Step 6: Verify Deployment
1. Go to "Deployments" tab in Nhost dashboard
2. Wait for deployment to complete (2-5 minutes)
3. Check logs for any errors
4. Your endpoint will be available at:
   ```
   https://your-project-name.nhost.run/v1/functions/waitlist
   ```

**Save this URL - you'll need it for frontend configuration!**

---

## Part 2: Build Frontend for Production

### Step 1: Configure Frontend API URL

Update your `.env.production` file:

```bash
VITE_API_URL=https://your-project-name.nhost.run/v1/functions
```

Replace `your-project-name` with your actual Nhost project name!

**Note:** The endpoint path is `/v1/functions/waitlist`, so your app will call:
```
VITE_API_URL + '/waitlist'
```

### Step 2: Update Frontend API Call (if needed)

Check [src/App.jsx](src/App.jsx#L64-L65) - the API call should look like:

```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const response = await fetch(`${apiUrl}/api/waitlist`, {  // ← Change this
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

**Update to:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const response = await fetch(`${apiUrl}/waitlist`, {  // ← No /api prefix
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

### Step 3: Build Frontend

Run the build command:

```bash
npm run build:frontend
```

This creates a `dist` folder with optimized static files:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── assets/ (your images)
```

---

## Part 3: Deploy Frontend to IONOS

### Step 1: Access IONOS Web Hosting
1. Log in to [IONOS Control Panel](https://www.ionos.com/login)
2. Navigate to your web hosting package
3. Go to "Webspace" or "File Manager"

### Step 2: Upload via FTP

#### Option A: IONOS File Manager (Easy)
1. Open IONOS File Manager in browser
2. Navigate to your domain's root directory (usually `/`)
3. Upload ALL contents of the `dist` folder:
   - Drag and drop all files from `dist/` folder
   - Make sure `index.html` is in the root
   - Upload the `assets` folder with all subfolders

#### Option B: FTP Client (Recommended for large files)
1. Download FileZilla or Cyberduck
2. Get FTP credentials from IONOS:
   - Host: Your IONOS FTP server
   - Username: Your IONOS username
   - Password: Your IONOS password
   - Port: 21 (or 22 for SFTP)

3. Connect and upload:
   - Navigate to your domain's root folder
   - Upload ALL contents of `dist/` folder
   - Verify all files transferred successfully

### Step 3: Configure Domain
1. In IONOS dashboard, ensure your domain points to the correct directory
2. If you have multiple domains, make sure the right one is selected
3. **SSL Certificate:** Enable free SSL in IONOS settings (important!)

---

## Part 4: Final Configuration

### Step 1: Update Backend FRONTEND_URL
Now that you know your IONOS domain, update Nhost:

1. Go to your Nhost dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://yourdomain.com
   ```
4. Save changes (Nhost will automatically redeploy)

### Step 2: Test Your Deployment

1. **Visit your IONOS domain:** `https://yourdomain.com`
2. **Test the waitlist form:**
   - Enter an email address
   - Submit the form
   - Check for success message
3. **Check email delivery:**
   - Verify confirmation email arrives
   - Check admin notification email
4. **Test duplicate prevention:**
   - Try submitting the same email again
   - Should show "You're already on the waitlist!"

### Step 3: Monitor Backend Logs
In your Nhost dashboard:
1. Navigate to "Logs" tab
2. Filter by "Functions"
3. Monitor real-time logs

Look for:
- ✅ Function execution started
- ✅ MongoDB Atlas connected successfully
- ✅ Email saved to database
- ✅ Emails sent via Resend

---

## Troubleshooting

### Issue: "Failed to process your request"
**Solution:** Check Nhost function logs for errors. Common causes:
- Invalid MONGODB_URI
- Invalid RESEND_API_KEY
- Missing environment variables

### Issue: CORS Error in Browser Console
**Solution:**
Nhost functions automatically handle CORS. If you see CORS errors:
1. Verify your frontend is calling the correct endpoint
2. Check that `FRONTEND_URL` is set correctly in Nhost
3. Ensure you're using HTTPS for your IONOS domain

### Issue: Emails Not Sending
**Solution:**
1. Verify `RESEND_API_KEY` is correct in Nhost environment
2. Check Resend dashboard for API usage/errors
3. Verify `FROM_EMAIL` domain is verified in Resend
4. Check Nhost function logs for Resend API errors

### Issue: 404 Error on Frontend Routes
**Solution:** IONOS might need `.htaccess` for SPA routing:

Create `.htaccess` in your dist folder before uploading:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Issue: Cold Starts / Slow First Request
**Note:** Nhost serverless functions have cold starts (~2-3 seconds)
- First request after inactivity takes longer
- This is normal behavior for serverless functions
- Subsequent requests are faster (under 1 second)
- Free tier projects pause after 7 days of inactivity

---

## Production Checklist

- [ ] Backend deployed to Nhost
- [ ] All environment variables configured correctly
- [ ] GitHub repository connected to Nhost
- [ ] Backend URL saved and documented
- [ ] Frontend API call updated (removed `/api` prefix)
- [ ] Frontend built with correct API URL
- [ ] Frontend uploaded to IONOS
- [ ] Domain SSL certificate enabled
- [ ] Waitlist form tested successfully
- [ ] Email delivery confirmed (user + admin)
- [ ] Duplicate email prevention working
- [ ] MongoDB storing entries correctly

---

## Maintenance & Updates

### Updating Frontend
1. Make changes to `src/` files
2. Run `npm run build:frontend`
3. Upload new `dist/` contents to IONOS via FTP

### Updating Backend
1. Make changes to `functions/` files
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend functions"
   git push origin main
   ```
3. Nhost automatically deploys from GitHub
4. Monitor deployment in Nhost dashboard

### Monitoring
- **MongoDB:** Check [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
- **Emails:** Check [Resend Dashboard](https://resend.com/emails)
- **Backend:** Check Nhost Logs in dashboard (filter by "Functions")
- **Frontend:** Use browser DevTools console

---

## Cost Summary

### Current Setup (Option 2):
- **Frontend (IONOS):** Included with your hosting plan
- **Backend (Nhost):** Free tier (1 project, pauses after 7 days inactivity) or $15/month for Starter (always-on)
- **MongoDB Atlas:** Free tier (512 MB storage, plenty for a waitlist)
- **Resend:** Free tier (100 emails/day, 3,000 emails/month)

**Total Monthly Cost:** $0 (completely free)

**If you need always-on:** $15/month for Nhost Starter plan

---

## Nhost Free Tier Limitations

- **1 project** maximum
- **1 GB-hour** of function execution per month (sufficient for most waitlists)
- **Cold starts:** 2-3 seconds for first request after inactivity
- **Auto-pause:** Projects pause after 7 days of no activity
- **No custom domains** on Functions (use Nhost subdomain)

**Free tier is perfect for:**
- Testing and development
- Low-traffic hobby projects
- MVP/proof of concept

**Upgrade to Starter if you need:**
- Multiple projects
- Faster cold starts
- Always-on availability
- Higher execution limits

---

## Local Development

### Option 1: Use Original Express Server
For local development, you can still use your original Express server:

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

The Express server ([server/index.js](server/index.js)) still works for local development!

### Option 2: Use Nhost CLI
To test with Nhost functions locally:

```bash
# Install Nhost CLI
npm install -g nhost

# Start local Nhost environment
nhost up

# Functions available at:
# http://localhost:1337/v1/functions/waitlist
```

---

## Support Resources

- **IONOS Support:** [ionos.com/help](https://www.ionos.com/help)
- **Nhost Docs:** [docs.nhost.io](https://docs.nhost.io)
- **Nhost Discord:** [discord.gg/9V7Qb2U](https://discord.gg/9V7Qb2U)
- **MongoDB Atlas:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Resend Docs:** [resend.com/docs](https://resend.com/docs)

---

## Questions?

If you encounter issues not covered in this guide:
1. Check Nhost function logs first (in dashboard under "Logs")
2. Check browser console for frontend errors
3. Verify all environment variables are correct
4. Test backend endpoint directly using curl or Postman:
   ```bash
   curl -X POST https://your-project.nhost.run/v1/functions/waitlist \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

**Good luck with your deployment! 🚀**
