const express = require('express');
const router = express.Router();
const cronService = require('../services/cronService');
const { adminLimiter } = require('../middleware/rateLimiter');
const config = require('../config/env');

/**
 * POST /admin/trigger-cron
 * Manually trigger cron job (for testing)
 * Requires API key authentication
 */
router.post('/trigger-cron', adminLimiter, async (req, res) => {
    try {
        // Simple API key authentication
        const apiKey = req.headers['x-api-key'];

        if (!apiKey || apiKey !== config.secretKey) {
            return res.status(401).json({
                error: 'Unauthorized: Invalid API key'
            });
        }

        // Send immediate response
        res.json({
            success: true,
            message: 'Cron job triggered successfully',
            status: 'running',
            note: 'The job is processing in the background. Check logs for details.'
        });

        // Run cron job asynchronously (non-blocking) after a short delay
        // to ensure the HTTP response is fully sent first.
        setTimeout(() => {
            cronService.runNow().catch(error => {
                console.error('Error in background cron execution:', error);
            });
        }, 0);

    } catch (error) {
        console.error('Error triggering cron job:', error);
        res.status(500).json({
            error: 'Failed to trigger cron job'
        });
    }
});

module.exports = router;
