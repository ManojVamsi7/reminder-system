# 🔧 Setup Instructions for NextGen Apply Renewal System

## ✅ Configuration Status

### Completed:
- ✅ Google Sheet ID configured
- ✅ Service account email configured
- ✅ Gmail address configured
- ✅ `.env` file created

### ⚠️ Still Needed:

## 1. Place Google Service Account JSON File

You mentioned you have the JSON file. Please:

1. **Locate your downloaded JSON file** (it should look like `nextgenapply-clients-xxxxx.json`)
2. **Rename it to:** `google-service-account.json`
3. **Move it to:** `/home/manojvamsi/Desktop/Reminder/reminder-system/credentials/`

**Command to copy (adjust source path):**
```bash
cp /path/to/your/downloaded-file.json /home/manojvamsi/Desktop/Reminder/reminder-system/credentials/google-service-account.json
```

## 2. Generate Gmail App Password

Since you're using Gmail (`nextgenapply.ai.renewals@gmail.com`), you need an **App Password**:

### Steps:
1. Go to your Google Account: https://myaccount.google.com/
2. Enable **2-Factor Authentication** (if not already enabled)
3. Go to **App Passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)**
5. Name it: "Renewal Reminder System"
6. Click **Generate**
7. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

### Update .env file:
Replace this line in `/home/manojvamsi/Desktop/Reminder/reminder-system/.env`:
```bash
EMAIL_APP_PASSWORD=your-gmail-app-password-here
```

With your actual app password (remove spaces):
```bash
EMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
```

## 3. Generate Secret Key

A secure secret key has been generated. Update this line in `.env`:
```bash
SECRET_KEY=your-secret-key-will-be-generated-below
```

**I'll provide the generated key in the next message.**

## 4. Verify Google Sheet Setup

Make sure your Google Sheet:
- Has the 14 required columns (see README.md)
- Is shared with: `renewal-bot@nextgenapply-clients.iam.gserviceaccount.com`
- Service account has **Editor** permissions

## 5. Test the System

Once all above steps are complete:

```bash
cd /home/manojvamsi/Desktop/Reminder/reminder-system
npm run dev
```

Then test the health endpoint:
```bash
curl http://localhost:3000/health
```

## 6. Manual Cron Test

Test email sending (after updating EMAIL_APP_PASSWORD):
```bash
curl -X POST http://localhost:3000/admin/trigger-cron \
  -H "x-api-key: YOUR_SECRET_KEY"
```

---

## Quick Checklist:

- [ ] Google service account JSON file in `credentials/` folder
- [ ] Gmail App Password generated and added to `.env`
- [ ] Secret key added to `.env`
- [ ] Google Sheet shared with service account
- [ ] Test with `npm run dev`

Let me know once you've completed these steps!
