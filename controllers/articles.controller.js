const { selectArticleById,
    removeHouseById,
    selectAllArticles,
    insertNewArticle,
    incVoteById
        } = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then(article => {
                res.status(200).send({ article });
        })
        .catch(next);
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    incVoteById(article_id, inc_votes)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
}

exports.deleteArticleById = (req, res, next) => {
    const { article_id } = req.params;
    removeHouseById(article_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
}

exports.getAllArticles = (req, res, next) => {
    const { sorted_by } = req.query;
    const { order } = req.query;
    const { author } = req.query;
    const { topic } = req.query;
    const { limit } = req.query;
    selectAllArticles(sorted_by, order, author, topic, limit)
        .then(articles => {
            res.status(200).send({ articles });
        })
        .catch(next);
}

exports.postNewArticle = (req, res, next) => {
    const articleInfo = req.body;
    insertNewArticle(articleInfo)
        .then((article) => {
            res.status(201).send({ article });
        })
        .catch(next);
}