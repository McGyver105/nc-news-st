const { selectArticleById, addCommentCount } = require('../models/articles.model');

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