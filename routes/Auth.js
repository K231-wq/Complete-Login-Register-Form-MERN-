const express = require('express');
const routers = express.Router();

const {
    register,
    login,
    logout
} = require('../controller/Auth');

routers.route('/register').post(register);
routers.route('/login').post(login);
routers.route('/logout').post(logout);

module.exports = routers;