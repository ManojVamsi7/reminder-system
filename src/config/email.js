const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const config = require('./env');

// Determine which email service to use
const useSendGrid = config.email.service.toLowerCase() === 'sendgrid';

if (useSendGrid) {
    // SendGrid HTTP API (works on Render free tier - no SMTP ports needed!)
    const apiKey = config.email.password;

    // Debug: Check if API key is loaded (without exposing full key)
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key starts with:', apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING');

    sgMail.setApiKey(apiKey); // API key is stored in EMAIL_APP_PASSWORD

    // Test the API key
    sgMail.setClient(require('@sendgrid/client'));
    console.log('✅ SendGrid HTTP API configured');

    // Create a nodemailer-compatible wrapper for SendGrid
    module.exports = {
        sendMail: async (mailOptions) => {
            try {
                const msg = {
                    to: mailOptions.to,
                    from: config.email.from || config.email.user,
                    subject: mailOptions.subject,
                    text: mailOptions.text,
                    html: mailOptions.html,
                };

                const response = await sgMail.send(msg);
                console.log(`✅ Email sent via SendGrid HTTP API to ${mailOptions.to}`);
                return response;
            } catch (error) {
                console.error('❌ SendGrid API error:', error.response?.body || error.message);
                throw error;
            }
        }
    };
} else {
    // Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        family: 4, // Force IPv4 to prevent ENETUNREACH on Railway
        auth: {
            user: config.email.user,
            pass: config.email.password,
        },
    });

    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ Gmail SMTP error:', error.message);
        } else {
            console.log('✅ Gmail SMTP ready');
        }
    });

    module.exports = transporter;
}
