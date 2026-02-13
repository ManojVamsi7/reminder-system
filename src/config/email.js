const nodemailer = require('nodemailer');
const config = require('./env');

// Create email transporter
// Supports both SendGrid (recommended for production) and Gmail SMTP (for local testing)
let transporter;

if (config.email.service.toLowerCase() === 'sendgrid') {
    // SendGrid configuration (recommended for Render.com and production)
    transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
            user: 'apikey', // This is always 'apikey' for SendGrid
            pass: config.email.password, // Your SendGrid API Key
        },
    });
} else {
    // Gmail SMTP configuration (for local development)
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: config.email.user,
            pass: config.email.password,
        },
    });
}

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email transporter configuration error:', error.message);
    } else {
        console.log(`✅ Email transporter ready (${config.email.service})`);
    }
});

module.exports = transporter;
