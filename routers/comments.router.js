const express = require('express');
const { postComment, getCommentsByArticleId } = require('../controllers/comments.controller')
const commentsRouter = express.Router({ mergeParams: true });

commentsRouter.route('/').post(postComment).get(getCommentsByArticleId);

module.exports = commentsRouter;