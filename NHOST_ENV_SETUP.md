# Nhost Environment Variables Setup

**IMPORTANT:** Environment variables CANNOT be set in `nhost.toml` - they must be configured through the Nhost Dashboard UI.

---

## How to Add Environment Variables

### Step 1: Go to Nhost Dashboard
1. Log in to [nhost.io](https://nhost.io)
2. Select your project
3. Click on "Settings" in the left sidebar

### Step 2: Navigate to Environment Variables
1. In Settings, find the "Environment Variables" section
2. Click "Add Variable" for each variable below

### Step 3: Add These Variables One by One

Click "Add Variable" and enter:

**Variable 1:**
- Key: `MONGODB_URI`
- Value: `mongodb+srv://flemingweiss2_db_user:v1xqwRVMB0JwdIJm@waitlist.4atvy7r.mongodb.net/?appName=Waitlist`

**Variable 2:**
- Key: `RESEND_API_KEY`
- Value: `re_yqGKjRGj_Df5fcKCzYwu6WB1KPcSHwXrD`

**Variable 3:**
- Key: `FROM_EMAIL`
- Value: `Smiler <onboarding@resend.dev>`

**Variable 4:**
- Key: `ADMIN_EMAIL`
- Value: `flemingweiss2@gmail.com`

**Variable 5:**
- Key: `FRONTEND_URL`
- Value: `https://yourdomain.com` (replace with your IONOS domain)

**Variable 6:**
- Key: `NODE_ENV`
- Value: `production`

### Step 4: Save and Redeploy
1. Click "Save" after adding all variables
2. Nhost will automatically trigger a redeployment
3. Wait 2-5 minutes for deployment to complete

---

## Verify Deployment

1. Go to "Deployments" tab in Nhost dashboard
2. Check that the latest deployment shows "SUCCESS"
3. Your function endpoint should be available at:
   ```
   https://your-project-name.nhost.run/v1/functions/waitlist
   ```

---

## Test Your Endpoint

```bash
curl -X POST https://your-project-name.nhost.run/v1/functions/waitlist \
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

---

## Important Notes

- ✅ `nhost.toml` should NOT contain environment variables
- ✅ All environment variables must be set via Dashboard UI
- ✅ Changes to environment variables trigger automatic redeployment
- ✅ Variables are available to all functions via `process.env`
