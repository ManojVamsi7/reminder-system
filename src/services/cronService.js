const cron = require('node-cron');
const sheetsService = require('./sheetsService');
const validationService = require('./validationService');
const tokenService = require('./tokenService');
const emailService = require('./emailService');
const config = require('../config/env');

/**
 * Process clients and send renewal reminders
 * @returns {Promise<Object>} Processing statistics
 */
async function processRenewalReminders() {
    console.log('\n=== Starting Renewal Reminder Cron Job ===');
    console.log(`Time: ${new Date().toISOString()}`);

    const stats = {
        total: 0,
        eligible: 0,
        sent: 0,
        failed: 0,
        errors: []
    };

    try {
        // Fetch all clients from Google Sheets
        const clients = await sheetsService.getAllClients();
        stats.total = clients.length;

        console.log(`Fetched ${clients.length} clients from Google Sheets`);

        // Process each client
        for (const client of clients) {
            try {
                // Check if client is eligible for reminder
                const isEligible = validationService.isEligibleForReminder(
                    client,
                    config.reminderDaysBefore
                );

                if (!isEligible) {
                    continue;
                }

                stats.eligible++;
                console.log(`\nProcessing eligible client: ${client.clientName} (${client.email})`);

                // Generate secure token
                const { token, expiry } = tokenService.generateToken(
                    client.clientId,
                    client.expiryDate
                );

                // Update Google Sheets with token
                await sheetsService.updateReminderSent(
                    client.rowIndex,
                    token,
                    expiry
                );

                // Update client object with token for email
                client.token = token;
                client.tokenExpiry = expiry;

                // Send email
                await emailService.sendReminderEmail(client, token);

                stats.sent++;
                console.log(`✓ Successfully sent reminder to ${client.email}`);

            } catch (error) {
                stats.failed++;
                const errorMsg = `Failed to process ${client.email}: ${error.message}`;
                stats.errors.push(errorMsg);
                console.error(`✗ ${errorMsg}`);
            }
        }

    } catch (error) {
        console.error('Critical error in cron job:', error);
        stats.errors.push(`Critical error: ${error.message}`);
    }

    // Log summary
    console.log('\n=== Cron Job Summary ===');
    console.log(`Total clients: ${stats.total}`);
    console.log(`Eligible for reminder: ${stats.eligible}`);
    console.log(`Successfully sent: ${stats.sent}`);
    console.log(`Failed: ${stats.failed}`);

    if (stats.errors.length > 0) {
        console.log('\nErrors:');
        stats.errors.forEach(err => console.log(`  - ${err}`));
    }

    console.log('=== Cron Job Complete ===\n');

    return stats;
}

/**
 * Start the cron job scheduler
 */
function startCronJob() {
    console.log('Initializing cron job scheduler...');
    console.log(`Schedule: ${config.cronSchedule}`);

    // Validate cron schedule
    if (!cron.validate(config.cronSchedule)) {
        throw new Error(`Invalid cron schedule: ${config.cronSchedule}`);
    }

    // Schedule the job
    const job = cron.schedule(config.cronSchedule, async () => {
        await processRenewalReminders();
    });

    console.log('✓ Cron job scheduled successfully');
    console.log(`Next run will be at the scheduled time: ${config.cronSchedule}`);

    return job;
}

/**
 * Run the cron job immediately (for testing)
 */
async function runNow() {
    console.log('Running cron job immediately (manual trigger)...');
    return await processRenewalReminders();
}

module.exports = {
    startCronJob,
    runNow,
    processRenewalReminders,
};
