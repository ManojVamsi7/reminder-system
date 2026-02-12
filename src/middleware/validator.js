/**
 * Validate request body for response submission
 */
function validateResponseSubmission(req, res, next) {
    const { response } = req.body;

    if (!response) {
        return res.status(400).json({
            error: 'Response is required'
        });
    }

    const validResponses = ['Interested', 'Not Interested'];
    if (!validResponses.includes(response)) {
        return res.status(400).json({
            error: 'Invalid response. Must be "Interested" or "Not Interested"'
        });
    }

    next();
}

/**
 * Sanitize input to prevent injection attacks
 */
function sanitizeInput(str) {
    if (typeof str !== 'string') return str;

    // Remove potentially dangerous characters
    return str
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim();
}

module.exports = {
    validateResponseSubmission,
    sanitizeInput,
};
