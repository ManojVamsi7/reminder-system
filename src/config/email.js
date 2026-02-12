const nodemailer = require('nodemailer');
const config = require('./env');

// Create email transporter
// Using explicit host and port 587 (STARTTLS) because port 465 often has IPv6/ENETUNREACH issues on Render
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.email.user,
        pass: config.email.password,
    },
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter configuration error:', error);
    } else {
        console.log('Email transporter is ready to send messages');
    }
});

module.exports = transporter;
