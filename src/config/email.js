const nodemailer = require('nodemailer');
const config = require('./env');

// Create email transporter
const transporter = nodemailer.createTransport({
    service: config.email.service,
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
