# 🚀 Deployment Guide - 24/7 Hosting

To make your reminder system run automatically every day (at 9 AM IST) and work for everyone, you need to host it on a public server. 

## Recommended: Render.com (Free & Easiest)

Render is great because it's free for small apps and incredibly easy to set up.

### Step 1: Upload to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 2: Create a Web Service on Render
1. Create a free account on [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Use these settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables
In the Render Dashboard, go to **Environment** and add all variables from your `.env` file:
- `GOOGLE_SHEET_ID`
- `EMAIL_SERVICE`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`
- `SECRET_KEY`
- `PORT` (set to `10000` - Render's default)
- `BASE_URL` (Set this to the URL Render gives you, e.g., `https://your-bot.onrender.com`)

### Step 4: Add Your Credentials (IMPORTANT)
For security, you **should not** upload your `google-service-account.json` to GitHub. Instead:
1. Open your `google-service-account.json` on your laptop and **copy all the text**.
2. Go to your Render Dashboard > **Environment**.
3. Add a new variable: 
   - Key: `GOOGLE_CREDENTIALS_JSON`
   - Value: (Paste the entire JSON text here)
4. Your code is now configured to read from this variable automatically!

### Step 5: Keep it 24/7 (Free Tier)
Render's Free Tier "sleeps" after 15 minutes of inactivity. To keep your cron job running:
1. Go to [UptimeRobot.com](https://uptimerobot.com) and create a free account.
2. Click **Add New Monitor**.
3. Monitor Type: **HTTP(s)**.
4. Friendly Name: `Reminder Bot`.
5. URL: `https://your-bot.onrender.com/health` (use your actual Render URL).
6. Monitoring Interval: **Every 5 minutes**.
7. This will "ping" your server constantly, keeping it awake so your 9 AM reminders always trigger!

---

## Alternative: AWS EC2 / DigitalOcean VPS
If you have a Linux server:
1. SSH into your server.
2. Clone the repo and run `npm install`.
3. Install **PM2** to keep the app running forever:
   ```bash
   npm install -g pm2
   pm2 start server.js --name reminder-bot
   pm2 save
   pm2 startup
   ```

---

## 🔒 Post-Deployment Security
- Always use **HTTPS** for your `BASE_URL`.
- Periodically check the logs to ensure the Google Sheets API quota is healthy.
- Monitor your Gmail "Sent" folder to confirm the 9 AM reminders are going out.
