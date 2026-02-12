# Quick Start - Test Your Renewal Reminder System

## ✅ What's Working:
- ✅ Google Sheets connection (40 clients loaded)
- ✅ Email transporter ready
- ✅ All code fixed and ready

## 🚀 Steps to Test:

### 1. Update C001 Payment Status
In your Google Sheet, change:
- **Row 2, Column H (Payment Status):** `Pending` → `Paid`

### 2. Start the Server
```bash
cd /home/manojvamsi/Desktop/Reminder/reminder-system
npm run dev
```

**Wait for this message:**
```
✓ Email transporter is ready to send messages
```

### 3. Trigger the Test (in a NEW terminal)
```bash
curl -X POST http://localhost:3000/admin/trigger-cron \
  -H "x-api-key: a7f3e9d2c1b4a8f6e5d3c2b1a9f8e7d6c5b4a3f2e1d9c8b7a6f5e4d3c2b1a0f9" \
  -H "Content-Type: application/json"
```

**curl will now return immediately:**
```json
{
  "success": true,
  "message": "Cron job triggered successfully",
  "status": "running",
  "note": "Check terminal logs for job progress and results"
}
```

### 4. Watch the Terminal (where npm run dev is running)

You'll see:
```
=== Starting Renewal Reminder Cron Job ===
Time: 2026-02-12T08:35:23.000Z
Fetched 40 clients from Google Sheets

Processing eligible client: Alpha Solutions Ltd (miniclipspubg@gmail.com)
✓ Successfully sent reminder to miniclipspubg@gmail.com

=== Cron Job Summary ===
Total clients: 40
Eligible for reminder: 1
Successfully sent: 1
Failed: 0
=== Cron Job Complete ===
```

### 5. Verify Results

**Check Google Sheet:**
- Column I: Should show "Yes"
- Column J: Should show today's date
- Column K: Should have a secure token
- Column L: Should show expiry date (7 days from now)

**Check Email:**
- Inbox: miniclipspubg@gmail.com
- Subject: "Your subscription expires in 5 days - Action Required"
- Contains: Secure link to response form

### 6. Test Response Form

Click the link in the email or go to:
```
http://localhost:3000/response/[TOKEN_FROM_COLUMN_K]
```

Submit your choice and check Column M & N get updated!

---

**Having issues? Run diagnostics:**
```bash
node test-sheets.js
```
