const CustomAPIError = require('./custom-error');
const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError
};