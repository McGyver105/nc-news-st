const { getUserById } = require('../controllers/users.controller');

const express = require('express');
const usersRouter = express.Router();

usersRouter.route('/:user').get(getUserById);

module.exports = usersRouter;