const { UnauthorizedError } = require('../errors');
const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("INVALID TOKEN CREDENTAIL ERROR~~");
    }
    const token = authHeader.split(" ")[1];
    try {
        const playload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: playload.userId,
            name: playload.name,
            email: playload.name,
        }
        next();
    } catch (error) {
        res.status(500).send("Jwt ERROR : " + error.message);
    }
}
module.exports = authentication;