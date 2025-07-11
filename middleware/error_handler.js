const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, nex) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "SOMETHING WENT WRONG! PLEASE TRY AGAING LATER!" });
}
module.exports = errorHandler;