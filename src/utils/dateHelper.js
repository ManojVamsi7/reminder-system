/**
 * Date helper utilities
 */

/**
 * Parse date from Sheet (supports DD/MM/YYYY and falling back to native)
 * @param {string} dateStr 
 * @returns {Date}
 */
function parseSheetDate(dateStr) {
    if (!dateStr) return new Date(NaN);
    if (dateStr instanceof Date) return dateStr;

    // Try parsing DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-indexed months
        const year = parseInt(parts[2], 10);

        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) return date;
    }

    return new Date(dateStr);
}

/**
 * Format date to readable string
 * @param {Date|string} date 
 * @returns {string}
 */
function formatDate(date) {
    const d = parseSheetDate(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get date N days from now
 * @param {number} days 
 * @returns {Date}
 */
function addDays(days) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date;
}

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 
 * @param {Date|string} date2 
 * @returns {boolean}
 */
function isSameDay(date1, date2) {
    const d1 = parseSheetDate(date1);
    const d2 = parseSheetDate(date2);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() === d2.getTime();
}

/**
 * Get days between two dates
 * @param {Date|string} date1 
 * @param {Date|string} date2 
 * @returns {number}
 */
function daysBetween(date1, date2) {
    const d1 = parseSheetDate(date1);
    const d2 = parseSheetDate(date2);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

module.exports = {
    parseSheetDate,
    formatDate,
    addDays,
    isSameDay,
    daysBetween,
};
