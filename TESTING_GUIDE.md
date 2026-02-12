# Testing Guide - Subscription Renewal Reminder System

## ✅ Server is Running!

Your server is now running successfully at `http://localhost:3000`

---

## 🧪 How to Test the System

### 1. **Test Health Endpoint**
Check if the server is responding:
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-12T07:56:55.000Z",
  "environment": "development"
}
```

---

### 2. **Manually Trigger the Cron Job**

This will:
- Read all clients from your Google Sheet
- Check which clients are eligible for reminders (Active, Paid, expiry in 5 days)
- Send reminder emails to eligible clients
- Update the sheet with reminder status and tokens

**Command:**
```bash
curl -X POST http://localhost:3000/admin/trigger-cron \
  -H "x-api-key: a7f3e9d2c1b4a8f6e5d3c2b1a9f8e7d6c5b4a3f2e1d9c8b7a6f5e4d3c2b1a0f9" \
  -H "Content-Type: application/json"
```

**What to Look For:**

Check the terminal where `npm run dev` is running. You should see:
```
=== Starting Renewal Reminder Cron Job ===
Time: 2026-02-12T07:56:55.123Z
Fetched X clients from Google Sheets

Processing eligible client: John Doe (john@example.com)
✓ Successfully sent reminder to john@example.com

=== Cron Job Summary ===
Total clients: X
Eligible for reminder: Y
Successfully sent: Y
Failed: 0
=== Cron Job Complete ===
```

---

### 3. **Check Your Google Sheet**

After running the cron job, check your Google Sheet:

**Columns to Verify:**
- **Column I (Reminder Sent):** Should change from "No" to "Yes"
- **Column J (Reminder Date):** Should show today's date
- **Column K (Token):** Should have a long secure token (UUID.HMAC)
- **Column L (Token Expiry):** Should show date 7 days from now

---

### 4. **Check Email**

**For Eligible Clients:**
- Check the inbox of the email address in your sheet
- You should receive a professional renewal reminder email
- The email will have a secure link like: `http://localhost:3000/response/[TOKEN]`

**Email Subject:** "Your subscription expires in 5 days - Action Required"

---

### 5. **Test the Response Form**

**Option A: Click the link in the email**

**Option B: Manually test with a token from your sheet:**
1. Copy a token from Column K of your Google Sheet
2. Open in browser: `http://localhost:3000/response/[PASTE_TOKEN_HERE]`

**You Should See:**
- A beautiful, responsive form
- Client's name and subscription details
- Two buttons: "Yes, I'm Interested" and "No, Not Interested"

**After Submitting:**
- Check Column M (Client Response): Should show "Interested" or "Not Interested"
- Check Column N (Response Date): Should show today's date
- Check Column K (Token): Should change to "USED"

---

### 6. **Test Token Security**

**Try using the same token again:**
```bash
# This should fail with "Token already used" or "Response already submitted"
```

**Try using an invalid token:**
```bash
curl http://localhost:3000/response/invalid-token-12345
# Should show error page
```

---

## 📊 Understanding Eligibility Criteria

A client is eligible for a reminder if **ALL** of these are true:
1. ✅ **Subscription Status** = "Active"
2. ✅ **Payment Status** = "Paid"
3. ✅ **Reminder Sent** = "No"
4. ✅ **Expiry Date** = Exactly 5 days from today

**Example:**
- Today: February 12, 2026
- Eligible clients: Those with expiry date = February 17, 2026

---

## 🔍 Troubleshooting

### No Emails Sent?

**Check:**
1. Are there any eligible clients? (Check criteria above)
2. Is the Gmail app password correct in `.env`?
3. Check terminal for error messages

**Test Email Configuration:**
```bash
# Check if email transporter is ready (should see in terminal when server starts)
# Look for: "Email transporter is ready to send messages"
```

### Google Sheets Not Updating?

**Check:**
1. Is the service account JSON file in the correct location?
2. Is the sheet shared with: `renewal-bot@nextgenapply-clients.iam.gserviceaccount.com`?
3. Does the service account have **Editor** permissions?
4. Check terminal for Google API errors

### Response Form Not Working?

**Check:**
1. Is the token valid and not expired?
2. Has the token already been used?
3. Check browser console for errors (F12)

---

## 📝 Sample Test Data

To test the system, add a row to your Google Sheet with:

| Column | Value |
|--------|-------|
| A - Client ID | TEST001 |
| B - Client Name | Test User |
| C - Email | your-test-email@gmail.com |
| D - Mobile | 1234567890 |
| E - Start Date | 2026-01-12 |
| F - Expiry Date | **2026-02-17** (5 days from today) |
| G - Subscription Status | Active |
| H - Payment Status | Paid |
| I - Reminder Sent | No |
| J-N | Leave empty |

Then run the manual cron trigger command!

---

## 🎯 Next Steps

1. ✅ Test with sample data
2. ✅ Verify emails are received
3. ✅ Test the response form
4. ✅ Check Google Sheet updates
5. 🚀 Deploy to production (see README.md)

---

## 📞 Support

If you encounter issues:
1. Check the terminal logs where `npm run dev` is running
2. Check the `logs/app.log` file
3. Verify all environment variables in `.env`
4. Ensure Google Sheet permissions are correct
