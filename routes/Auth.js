const express = require('express');
const routers = express.Router();
const userAuth = require('../middleware/userAuth');
const {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail
} = require('../controller/Auth');

routers.route('/register').post(register);
routers.route('/login').post(login);
routers.route('/logout').post(logout);
routers.route('/send-verify-otp').post(userAuth, sendVerifyOtp);
routers.route('/verify-otp').post(userAuth, verifyEmail);

module.exports = routers;