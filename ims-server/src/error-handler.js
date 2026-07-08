/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: error-handler.js
 * Description: Error handling middleware functions.
 */

// Require statements
const createError = require('http-errors');

const notFoundHandler = (req, res, next) => {
    const error = createError(404, 'Not Found');
    next(error);
};

const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        type: 'error',
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
        stack: req.app.get('env') === 'development' ? err.stack : undefined

    });
}

// Export middleware functions
module.exports = {
    notFoundHandler,
    errorHandler
};

