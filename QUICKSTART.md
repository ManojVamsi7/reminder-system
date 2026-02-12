# Quick Start Guide

Follow these steps to get the system running:

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Google Cloud

1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create a Service Account
4. Download the JSON credentials file
5. Save it as `credentials/google-service-account.json`

## 3. Create Google Sheet

1. Create a new Google Sheet with these columns:
   - Client ID, Client Name, Email, Mobile Number
   - Subscription Start Date, Subscription Expiry Date
   - Subscription Status, Payment Status
   - Reminder Sent, Reminder Sent Date
   - Secure Token, Token Expiry
   - Client Response, Response Date

2. Share the sheet with your service account email (from the JSON file)

3. Copy the Sheet ID from the URL

## 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `GOOGLE_SHEET_ID` - Your Google Sheet ID
- `EMAIL_USER` - Your Gmail address
- `EMAIL_APP_PASSWORD` - Gmail app password (not your regular password)
- `SECRET_KEY` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `COMPANY_NAME` - Your company name
- `BASE_URL` - Your domain (or http://localhost:3000 for local)

## 5. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000/health to verify the server is running.

## 6. Test Email Sending

Manually trigger the cron job:

```bash
curl -X POST http://localhost:3000/admin/trigger-cron \
  -H "x-api-key: YOUR_SECRET_KEY"
```

## 7. Deploy to Production

Choose a deployment platform:
- **Railway** (easiest, recommended)
- **Render** (simple, free tier)
- **AWS EC2** (more control)
- **Vercel** (serverless)

See README.md for detailed deployment instructions.

## Common Issues

**Email not sending?**
- Enable 2FA on Gmail
- Generate app password at https://myaccount.google.com/apppasswords
- Use the 16-character password (no spaces)

**Google Sheets permission denied?**
- Share the sheet with the service account email
- Give Editor permissions

**Cron not running?**
- Check the cron schedule format
- Manually trigger with the admin endpoint
- Check logs in `logs/app.log`

## Need Help?

See the full README.md for comprehensive documentation.
