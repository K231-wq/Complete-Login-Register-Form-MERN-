const express = require('express');
const routers = express.Router();

const {
    welcome,
    create,
    store,
    show,
    edit,
    destroy
} = require('../controller/page');

routers.route('/').get(create).post(store);
routers.route('/:id').get(show).patch(edit).delete(destroy);

module.exports = routers;