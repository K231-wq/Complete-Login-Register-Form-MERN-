const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Not Authorized. Login Again' });
    }
    try {
        const tokenDecoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecoded.userId) {
            req.body.userId = tokenDecoded.userId;
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "IMPORTANT INFORMATION IS MISSING" });
        }
        next();
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}
module.exports = userAuth;