const express = require('express');
const articlesRouter = express.Router();
const { getArticleById } = require('../controllers/articles.controller');

articlesRouter.route('/:article_id').get(getArticleById);

module.exports = articlesRouter;