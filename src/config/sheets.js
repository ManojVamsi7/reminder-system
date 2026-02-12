const { google } = require('googleapis');
const path = require('path');
const config = require('./env');

// Initialize Google Sheets API client
let auth;

// If credentials are provided via environment variable (Production), use them
if (process.env.GOOGLE_CREDENTIALS_JSON) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
        auth = google.auth.fromJSON(credentials);
        auth.scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    } catch (error) {
        console.error('❌ Error parsing GOOGLE_CREDENTIALS_JSON:', error.message);
    }
}

// Fallback to keyFile if auth wasn't initialized (Local Development)
if (!auth) {
    auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../credentials/google-service-account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

const sheets = google.sheets({ version: 'v4', auth });

module.exports = {
    sheets,
    spreadsheetId: config.googleSheetId,
};
