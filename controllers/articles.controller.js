const { selectArticleById, addCommentCount, insertNewVote } = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then(rawArticle => {
            if (rawArticle === undefined) {
                throw ({ status: 404, msg: 'article not found' });
            } else {
                return addCommentCount(rawArticle, article_id);
            }
        })
        .then((article) => {
            res.status(200).send({ article });
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