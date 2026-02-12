require('dotenv').config();

module.exports = {
  // Google Sheets
  googleSheetId: process.env.GOOGLE_SHEET_ID,
  googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,

  // Email
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_APP_PASSWORD,
    from: process.env.EMAIL_FROM,
  },

  // Company
  companyName: process.env.COMPANY_NAME || 'Your Company',

  // Security
  secretKey: process.env.SECRET_KEY,

  // Application
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Cron
  cronSchedule: process.env.CRON_SCHEDULE || '0 9 * * *', // 9 AM daily

  // Token
  tokenExpiryDays: parseInt(process.env.TOKEN_EXPIRY_DAYS) || 7,

  // Reminder
  reminderDaysBefore: parseInt(process.env.REMINDER_DAYS_BEFORE) || 5,
};
