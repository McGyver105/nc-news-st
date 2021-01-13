const { getUserById } = require('../controllers/users.controller');

const express = require('express');
const usersRouter = express.Router();

usersRouter.route('/:username').get(getUserById);

module.exports = usersRouter;