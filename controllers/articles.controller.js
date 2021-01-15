const { selectArticleById,
    insertNewVote,
    removeHouseById,
    selectAllArticles,
    insertNewArticle
        } = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then(article => {
            if (article === undefined) {
                throw ({ status: 404, msg: 'article not found' });
            } else {
                res.status(200).send({ article });
            }
        })
        .catch(next);
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    selectArticleById(article_id)
        .then(article => {
            if (article === undefined) {
                throw ({ status: 404, msg: 'article not found' })
            } else {
                const { votes } = article;
                const newVote = votes + inc_votes;
                return insertNewVote(newVote, article_id);
            }
        })
        .then((updatedArticle) => {
            res.status(200).send({ updatedArticle });
        })
        .catch(next);
}

exports.deleteArticleById = (req, res, next) => {
    const { article_id } = req.params;
    removeHouseById(article_id)
        .then((deleteCount) => {
            if (deleteCount === 0) throw ({ status: 404, msg: 'article not found' });
            else res.sendStatus(204);
        })
        .catch(next);
}

exports.getAllArticles = (req, res, next) => {
    const { sorted_by } = req.query;
    const { order } = req.query;
    const { author } = req.query;
    const { topic } = req.query;
    selectAllArticles(sorted_by, order, author, topic)
        .then(articles => {
            if (articles.length === 0) res.status(404).send({ msg: 'no articles found' });
            else res.status(200).send({ articles });
        })
        .catch(next);
}

exports.postNewArticle = (req, res, next) => {
    const articleInfo = req.body;
    insertNewArticle(articleInfo)
        .then((createdArticle) => {
            res.status(201).send({ createdArticle });
        })
        .catch(next);
}