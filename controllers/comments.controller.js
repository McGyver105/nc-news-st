const { addNewComment, selectCommentsByArticleId, patchCommentVotesById, deleteCommentById } = require('../models/comments.model');

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
    const { sorted_by } = req.query;
    const { order } = req.query;
    selectCommentsByArticleId(article_id, sorted_by, order)
        .then((comments) => {
            res.status(200).send({comments})
        })
        .catch(next);
}

exports.updateCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    if (inc_votes === undefined) throw ({ code: '22P02'})
    patchCommentVotesById(comment_id, inc_votes)
        .then((updatedComment) => {
            if (updatedComment === undefined) throw ({ status: 404, msg: 'comment not found' });
            res.status(200).send({ updatedComment });
        })
        .catch(next);
}

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentById(comment_id)
        .then((deleteCount) => {
            if (deleteCount === 0) throw ({ status: 404, msg: 'comment not found' });
            else res.sendStatus(204);
        })
        .catch(next);
}