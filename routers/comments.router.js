const express = require('express');
const { postComment, getCommentsByArticleId, updateCommentVotes, removeCommentById } = require('../controllers/comments.controller')
const commentsRouter = express.Router({ mergeParams: true });

commentsRouter.route('/').post(postComment).get(getCommentsByArticleId);
commentsRouter.route('/:comment_id').patch(updateCommentVotes).delete(removeCommentById);

module.exports = commentsRouter;