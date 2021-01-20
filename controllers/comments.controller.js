const { addNewComment, selectCommentsByArticleId, patchCommentVotesById, deleteCommentById } = require('../models/comments.model');

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;
    addNewComment(article_id, body)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { sorted_by } = req.query;
    const { order } = req.query;
    selectCommentsByArticleId(article_id, sorted_by, order)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch(next);
}

exports.updateCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    patchCommentVotesById(comment_id, inc_votes)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch(next);
}

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentById(comment_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
}