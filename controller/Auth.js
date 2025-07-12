const User = require('../models/User');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        // throw new BadRequestError("Please Enter Name, Email & Passwoord!!");
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please Enter Name, Email & Passwoord!!" })
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "User is already existed!" });
        }
        const user = await User.create({ ...req.body });
        if (!user) {
            // throw new BadRequestError("SOMETHING WENT WRONG AT STORING DATA TO DB");
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "SOMETHING WENT WRONG AT STORING DATA TO DB" });
        }
        const token = user.createJWT();
        console.log("Bearer " + token);
        if (!token) {
            // throw new BadRequestError("Token is not generate!!");
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Token is not Found!" });
        }
        res.status(StatusCodes.OK).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 1000 * 60 * 60
        });
        res.status(StatusCodes.OK).json({
            success: true
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        // throw new BadRequestError("Please Enter Email & Password!!");
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please Enter Email & Password!!" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // throw new NotFoundError("EMAIL ISN'T FOUND IN DB, PLEASE REGISTER AN ACCOUNT!!");
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "EMAIL ISN'T FOUND IN DB, PLEASE REGISTER AN ACCOUNT!!" })
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // throw new BadRequestError("PASSWORD ISN'T CORRECT. RE-ENTER PASSWORD AFAIN!");
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "INVALID CRENDENTAIL PASSWORD!" });
        }
        const token = await user.createJWT();
        res.status(StatusCodes.OK).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 1000 * 60 * 60
        });

        res.status(StatusCodes.OK).json({
            success: true
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Logged Out"
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}
module.exports = {
    register,
    login,
    logout
};