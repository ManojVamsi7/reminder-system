const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./src/config/env');
const cronService = require('./src/services/cronService');
const responseRoutes = require('./src/routes/response');
const adminRoutes = require('./src/routes/admin');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();

// Trust proxy (required for Railway/Render/Heroku)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: config.nodeEnv === 'production' ? config.baseUrl : '*',
    methods: ['GET', 'POST'],
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/response', responseRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Subscription Renewal Reminder System',
        version: '1.0.0',
        status: 'running',
    });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    console.log('\n===========================================');
    console.log('🚀 Subscription Renewal Reminder System');
    console.log('===========================================');
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Server running on: ${config.baseUrl}`);
    console.log(`Port: ${PORT}`);
    console.log('===========================================\n');

    // Start cron job
    try {
        cronService.startCronJob();
    } catch (error) {
        console.error('Failed to start cron job:', error);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

module.exports = app;
