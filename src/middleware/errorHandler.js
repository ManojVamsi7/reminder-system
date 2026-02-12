/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Don't expose internal errors to client in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    const statusCode = err.statusCode || 500;
    const message = isDevelopment ? err.message : 'An error occurred. Please try again later.';

    res.status(statusCode).json({
        error: message,
        ...(isDevelopment && { stack: err.stack })
    });
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Endpoint not found'
    });
}

module.exports = {
    errorHandler,
    notFoundHandler,
};
