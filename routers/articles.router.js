const express = require('express');
const articlesRouter = express.Router();
const commentsRouter = require('../routers/comments.router')
const { getArticleById, patchArticleById, deleteArticleById } = require('../controllers/articles.controller');

articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleById).delete(deleteArticleById)
articlesRouter.use('/:article_id/comments', commentsRouter);

module.exports = articlesRouter;