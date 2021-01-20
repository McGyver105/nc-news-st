const express = require('express');
const articlesRouter = express.Router();
const commentsRouter = require('../routers/comments.router')
const { getArticleById,
    patchArticleById,
    deleteArticleById,
    getAllArticles,
    postNewArticle
        } = require('../controllers/articles.controller');

articlesRouter.route('/').get(getAllArticles).post(postNewArticle)

articlesRouter.use('/:article_id/comments', commentsRouter);

articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleById).delete(deleteArticleById)



module.exports = articlesRouter;