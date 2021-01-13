const express = require('express');
const { postComment } = require('../controllers/comments.controller')
const commentsRouter = express.Router({ mergeParams: true });

commentsRouter.route('/').post(postComment);

module.exports = commentsRouter;