# Nhost Serverless Functions

This directory contains serverless functions for deployment to nhost.io.

## Available Functions

### `waitlist.js`
Handles waitlist signup requests.

**Endpoint:** `POST https://your-project.nhost.run/v1/functions/waitlist`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully joined the waitlist! Check your email for confirmation."
}
```

**Response (Already Subscribed):**
```json
{
  "error": "You're already on the waitlist!",
  "alreadySubscribed": true
}
```

## Local Testing

To test functions locally with the Nhost CLI:

```bash
# Install Nhost CLI
npm install -g nhost

# Start local Nhost environment
nhost up

# Your function will be available at:
# http://localhost:1337/v1/functions/waitlist
```

## Environment Variables Required

These are configured in `nhost/nhost.toml` or via the Nhost Dashboard:

- `MONGODB_URI` - MongoDB Atlas connection string
- `RESEND_API_KEY` - Resend email API key
- `FROM_EMAIL` - Sender email address
- `ADMIN_EMAIL` - Admin email for notifications
- `FRONTEND_URL` - Your IONOS domain URL
- `NODE_ENV` - Set to "production"

## Deployment

Functions are automatically deployed when you:
1. Push to your connected GitHub repository
2. Or manually deploy using: `nhost deploy`

The functions will be available at:
```
https://your-project-name.nhost.run/v1/functions/waitlist
```
