const { selectArticleById, insertNewVote, removeHouseById } = require('../models/articles.model');

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