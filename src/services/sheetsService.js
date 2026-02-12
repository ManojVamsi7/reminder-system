const { sheets, spreadsheetId } = require('../config/sheets');

// Column mapping for Google Sheets
const COLUMNS = {
    CLIENT_ID: 0,        // A
    CLIENT_NAME: 1,      // B
    EMAIL: 2,            // C
    MOBILE: 3,           // D
    START_DATE: 4,       // E
    EXPIRY_DATE: 5,      // F
    SUB_STATUS: 6,       // G
    PAYMENT_STATUS: 7,   // H
    REMINDER_SENT: 8,    // I
    REMINDER_DATE: 9,    // J
    TOKEN: 10,           // K
    TOKEN_EXPIRY: 11,    // L
    RESPONSE: 12,        // M
    RESPONSE_DATE: 13    // N
};

/**
 * Get all client data from Google Sheets
 * @returns {Promise<Array>} Array of client objects
 */
async function getAllClients() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A2:N10000', // Skip header row, read up to 10k rows
        });

        const rows = response.data.values || [];

        return rows.map((row, index) => ({
            rowIndex: index + 2, // +2 because: 0-indexed array + skip header row
            clientId: row[COLUMNS.CLIENT_ID] || '',
            clientName: row[COLUMNS.CLIENT_NAME] || '',
            email: row[COLUMNS.EMAIL] || '',
            mobile: row[COLUMNS.MOBILE] || '',
            startDate: row[COLUMNS.START_DATE] || '',
            expiryDate: row[COLUMNS.EXPIRY_DATE] || '',
            subscriptionStatus: row[COLUMNS.SUB_STATUS] || '',
            paymentStatus: row[COLUMNS.PAYMENT_STATUS] || '',
            reminderSent: row[COLUMNS.REMINDER_SENT] || 'No',
            reminderDate: row[COLUMNS.REMINDER_DATE] || '',
            token: row[COLUMNS.TOKEN] || '',
            tokenExpiry: row[COLUMNS.TOKEN_EXPIRY] || '',
            clientResponse: row[COLUMNS.RESPONSE] || 'No Response',
            responseDate: row[COLUMNS.RESPONSE_DATE] || '',
        }));
    } catch (error) {
        console.error('Error fetching clients from Google Sheets:', error);
        throw error;
    }
}

/**
 * Update reminder sent status and token for a client
 * @param {number} rowIndex - Row number in sheet (1-indexed)
 * @param {string} token - Generated secure token
 * @param {string} tokenExpiry - Token expiry timestamp
 */
async function updateReminderSent(rowIndex, token, tokenExpiry) {
    try {
        const today = new Date().toISOString().split('T')[0];

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!I${rowIndex}:L${rowIndex}`,
            valueInputOption: 'RAW',
            resource: {
                values: [['Yes', today, token, tokenExpiry]]
            }
        });
    } catch (error) {
        console.error(`Error updating reminder sent for row ${rowIndex}:`, error);
        throw error;
    }
}

/**
 * Get client by token
 * @param {string} token - Secure token
 * @returns {Promise<Object|null>} Client object or null
 */
async function getClientByToken(token) {
    try {
        const clients = await getAllClients();
        return clients.find(client => client.token === token) || null;
    } catch (error) {
        console.error('Error fetching client by token:', error);
        throw error;
    }
}

/**
 * Update client response
 * @param {number} rowIndex - Row number in sheet (1-indexed)
 * @param {string} response - Client response (Interested/Not Interested)
 */
async function updateClientResponse(rowIndex, response) {
    try {
        const today = new Date().toISOString().split('T')[0];

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!M${rowIndex}:N${rowIndex}`,
            valueInputOption: 'RAW',
            resource: {
                values: [[response, today]]
            }
        });
    } catch (error) {
        console.error(`Error updating client response for row ${rowIndex}:`, error);
        throw error;
    }
}

/**
 * Invalidate token by clearing it
 * @param {number} rowIndex - Row number in sheet (1-indexed)
 */
async function invalidateToken(rowIndex) {
    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!K${rowIndex}:L${rowIndex}`,
            valueInputOption: 'RAW',
            resource: {
                values: [['USED', '']]
            }
        });
    } catch (error) {
        console.error(`Error invalidating token for row ${rowIndex}:`, error);
        throw error;
    }
}

module.exports = {
    COLUMNS,
    getAllClients,
    updateReminderSent,
    getClientByToken,
    updateClientResponse,
    invalidateToken,
};
