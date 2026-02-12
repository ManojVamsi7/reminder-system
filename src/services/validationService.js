const dateHelper = require('../utils/dateHelper');

/**
 * Validation Service
 * Validates manually entered client data from Google Sheets
 */

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;

    // RFC 5322 simplified regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Validate date format and validity
 * @param {string} dateStr 
 * @returns {boolean}
 */
function isValidDate(dateStr) {
    if (!dateStr) return false;

    const date = dateHelper.parseSheetDate(dateStr);
    return date instanceof Date && !isNaN(date);
}

/**
 * Validate subscription status
 * @param {string} status 
 * @returns {boolean}
 */
function isValidSubscriptionStatus(status) {
    const validStatuses = ['Active', 'Expired', 'Cancelled'];
    return validStatuses.includes(status);
}

/**
 * Validate payment status
 * @param {string} status 
 * @returns {boolean}
 */
function isValidPaymentStatus(status) {
    const validStatuses = ['Paid', 'Pending', 'Overdue'];
    return validStatuses.includes(status);
}

/**
 * Validate client name
 * @param {string} name 
 * @returns {boolean}
 */
function isValidClientName(name) {
    if (!name || typeof name !== 'string') return false;

    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
}

/**
 * Validate that expiry date is after start date
 * @param {string} startDate 
 * @param {string} expiryDate 
 * @returns {boolean}
 */
function isExpiryAfterStart(startDate, expiryDate) {
    if (!isValidDate(startDate) || !isValidDate(expiryDate)) return false;

    const start = dateHelper.parseSheetDate(startDate);
    const expiry = dateHelper.parseSheetDate(expiryDate);

    return expiry > start;
}

/**
 * Validate complete client record
 * @param {Object} client 
 * @returns {Object} { isValid: boolean, errors: Array<string> }
 */
function validateClient(client) {
    const errors = [];

    // Required fields
    if (!client.clientId || !client.clientId.trim()) {
        errors.push('Client ID is required');
    }

    if (!isValidClientName(client.clientName)) {
        errors.push('Client Name must be 2-100 characters');
    }

    if (!isValidEmail(client.email)) {
        errors.push('Invalid email format');
    }

    if (!isValidDate(client.startDate)) {
        errors.push('Invalid Subscription Start Date');
    }

    if (!isValidDate(client.expiryDate)) {
        errors.push('Invalid Subscription Expiry Date');
    }

    if (!isExpiryAfterStart(client.startDate, client.expiryDate)) {
        errors.push('Expiry Date must be after Start Date');
    }

    if (!isValidSubscriptionStatus(client.subscriptionStatus)) {
        errors.push('Invalid Subscription Status (must be: Active, Expired, or Cancelled)');
    }

    if (!isValidPaymentStatus(client.paymentStatus)) {
        errors.push('Invalid Payment Status (must be: Paid, Pending, or Overdue)');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Check if client is eligible for reminder
 * @param {Object} client 
 * @param {number} daysBeforeExpiry - Number of days before expiry to send reminder
 * @returns {boolean}
 */
function isEligibleForReminder(client, daysBeforeExpiry = 5) {
    // First validate the client data
    const validation = validateClient(client);
    if (!validation.isValid) {
        return false;
    }

    // Check business rules
    if (client.subscriptionStatus !== 'Active') {
        return false;
    }

    // For production, we typically only send reminders to 'Paid' subscriptions.
    // To allow 'Pending' subscriptions as well, change this to:
    // if (client.paymentStatus !== 'Paid' && client.paymentStatus !== 'Pending')
    if (client.paymentStatus !== 'Paid') {
        return false;
    }

    if (client.reminderSent === 'Yes' || client.reminderSent === 'TRUE') {
        return false;
    }

    // Check if expiry date is exactly N days from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = dateHelper.parseSheetDate(client.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);

    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + daysBeforeExpiry);

    return expiryDate.getTime() === targetDate.getTime();
}

module.exports = {
    isValidEmail,
    isValidDate,
    isValidSubscriptionStatus,
    isValidPaymentStatus,
    isValidClientName,
    isExpiryAfterStart,
    validateClient,
    isEligibleForReminder,
};
