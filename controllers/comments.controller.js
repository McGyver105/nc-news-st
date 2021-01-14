const { addNewComment } = require('../models/comments.model')
    ;
exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;
    addNewComment(article_id, body)
        .then((postedComment) => {
            res.status(200).send({ postedComment });
        })
        .catch(next);
}