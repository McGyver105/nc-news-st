const { addNewComment, selectCommentsByArticleId } = require('../models/comments.model');

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;
    addNewComment(article_id, body)
        .then((postedComment) => {
            res.status(200).send({ postedComment });
        })
        .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({comments})
        })
        .catch(next);
}