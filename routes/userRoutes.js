const express = require('express');
const routers = express.Router();
const userAuth = require('../middleware/userAuth');

const {
    getUser
} = require('../controller/userController');

routers.route('/data').get(userAuth, getUser);

module.exports = routers;