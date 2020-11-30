const GlobalError = require('../utils/globalError');

const sendError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const handleDuplicateMongoFields = error => {
    let message;
    if ('email' in error.keyValue) {
        message = 'This email is already linked to an exsisting account.';
    } else if (error.keyValue.unique.split('-')[2] === 'wave') {
        message = 'You already waved at this user';
    }

    return new GlobalError(message, 400);
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error 👀';

    let error = { ...err };

    if (error.code === 11000) {
        error = handleDuplicateMongoFields(error);
        sendError(error, res);
    } else {
        sendError(err, res);
    }
};
