const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

const getUser = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("userId" + userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User is not Found!"
            })
        }
        res.status(StatusCodes.OK).json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}
module.exports = {
    getUser
}