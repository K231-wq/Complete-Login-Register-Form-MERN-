require('dotenv').config();

const User = require('../models/User');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const transporter = require('../config/nodemailer');
const { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } = require('../config/emailTemplates');

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
        if (!token) {
            // throw new BadRequestError("Token is not generate!!");
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Token is not Found!" });
        }
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 1000 * 60 * 60
        });
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Golden Watch",
            text: `Welcome to Golden Watch Websites, your account is successfully registered with ${email}`,
        };
        await transporter.sendMail(mailOptions);

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
        res.cookie('token', token, {
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

const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(userId);

        //no need to add {} in findbyId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Please login again!" });
        }
        if (user.isAccountVerified) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Account has been verified!" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            // text: `Your OTP is ${otp}. Verify your account using this OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
        }
        await transporter.sendMail(mailOptions);

        res.status(StatusCodes.OK).json({ success: true, message: `Verification OTP Sent on ${user.email}` });
    } catch (error) {
        return res.statu(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}

const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing Details" });
    }
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User is not found!" });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid OTP!" });
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "OTP Expired!" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(StatusCodes.OK).json({ success: true, message: `${user.email} is verified successfully!` });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}

const isAuthenticated = async (req, res) => {
    try {
        return res.status(StatusCodes.OK).json({ success: true })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}

const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            success: false,
            message: "Email is required"
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!email) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User is not found"
            });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            // text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp),
        }
        await transporter.sendMail(mailOptions);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "OTP sent to your password"
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Email, OTP and Password are required"
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User is not found"
            });
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid OTP!"
            });
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "OTP Expired!"
            });
        }

        user.password = newPassword;

        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,
    resetPassword
};