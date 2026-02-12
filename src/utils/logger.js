/**
 * Logger utility
 * Simple logging with timestamps
 */

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'app.log');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Log message to file and console
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Log message
 */
function log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    // Write to file
    fs.appendFileSync(logFile, logMessage);

    // Also log to console
    console.log(logMessage.trim());
}

function info(message) {
    log('INFO', message);
}

function warn(message) {
    log('WARN', message);
}

function error(message) {
    log('ERROR', message);
}

module.exports = {
    info,
    warn,
    error,
};
