const { getUserById, fetchAllUsers, addNewUser } = require('../controllers/users.controller');

const express = require('express');
const usersRouter = express.Router();

usersRouter.route('/').get(fetchAllUsers).post(addNewUser);
usersRouter.route('/:username').get(getUserById);

module.exports = usersRouter;