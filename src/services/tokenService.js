const crypto = require('crypto');
const config = require('../config/env');

/**
 * Generate a secure token using UUID v4 + HMAC signature
 * @param {string} clientId 
 * @param {string} expiryDate 
 * @returns {Object} { token: string, expiry: string }
 */
function generateToken(clientId, expiryDate) {
    // Generate UUID v4
    const uuid = crypto.randomUUID();

    // Create HMAC signature
    const hmac = crypto
        .createHmac('sha256', config.secretKey)
        .update(`${uuid}${clientId}${expiryDate}`)
        .digest('hex')
        .substring(0, 16); // Use first 16 chars for compact URL

    // Combine UUID and HMAC
    const token = `${uuid}.${hmac}`;

    // Calculate token expiry (7 days from now)
    const expiryTimestamp = new Date();
    expiryTimestamp.setDate(expiryTimestamp.getDate() + config.tokenExpiryDays);

    return {
        token,
        expiry: expiryTimestamp.toISOString()
    };
}

/**
 * Validate token structure and HMAC signature
 * @param {string} token 
 * @param {Object} client - Client object from database
 * @returns {Object} { isValid: boolean, reason: string }
 */
function validateTokenSignature(token, client) {
    if (!token || typeof token !== 'string') {
        return { isValid: false, reason: 'Invalid token format' };
    }

    // Split token into UUID and HMAC
    const parts = token.split('.');
    if (parts.length !== 2) {
        return { isValid: false, reason: 'Invalid token structure' };
    }

    const [uuid, providedHmac] = parts;

    // Regenerate HMAC
    const expectedHmac = crypto
        .createHmac('sha256', config.secretKey)
        .update(`${uuid}${client.clientId}${client.expiryDate}`)
        .digest('hex')
        .substring(0, 16);

    // Compare HMACs (constant-time comparison to prevent timing attacks)
    const isValidSignature = crypto.timingSafeEqual(
        Buffer.from(providedHmac),
        Buffer.from(expectedHmac)
    );

    if (!isValidSignature) {
        return { isValid: false, reason: 'Invalid token signature' };
    }

    return { isValid: true, reason: 'Valid' };
}

/**
 * Check if token has expired
 * @param {string} tokenExpiry - ISO timestamp
 * @returns {boolean}
 */
function isTokenExpired(tokenExpiry) {
    if (!tokenExpiry) return true;

    const expiry = new Date(tokenExpiry);
    const now = new Date();

    return now > expiry;
}

/**
 * Check if token has already been used
 * @param {Object} client 
 * @returns {boolean}
 */
function isTokenUsed(client) {
    // Token is considered used if client has already responded
    return client.clientResponse !== 'No Response';
}

/**
 * Comprehensive token validation
 * @param {string} token 
 * @param {Object} client 
 * @returns {Object} { isValid: boolean, reason: string }
 */
function validateToken(token, client) {
    if (!client) {
        return { isValid: false, reason: 'Token not found' };
    }

    // Check if token matches
    if (client.token !== token) {
        return { isValid: false, reason: 'Token mismatch' };
    }

    // Check if token was already used
    if (client.token === 'USED') {
        return { isValid: false, reason: 'Token already used' };
    }

    // Check signature
    const signatureValidation = validateTokenSignature(token, client);
    if (!signatureValidation.isValid) {
        return signatureValidation;
    }

    // Check expiry
    if (isTokenExpired(client.tokenExpiry)) {
        return { isValid: false, reason: 'Token expired' };
    }

    // Check if already responded (single-use enforcement)
    if (isTokenUsed(client)) {
        return { isValid: false, reason: 'Response already submitted' };
    }

    return { isValid: true, reason: 'Valid' };
}

module.exports = {
    generateToken,
    validateToken,
    validateTokenSignature,
    isTokenExpired,
    isTokenUsed,
};
