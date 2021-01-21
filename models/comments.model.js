const connection = require('../db/connection');
const articlesRouter = require('../routers/articles.router');
const { selectArticleById } = require('./articles.model');

const addNewComment = (article_id, newComment) => {
    return connection
        .insert({ article_id, author: newComment['username'], body: newComment['body'] })
        .into('comments')
        .returning('*')
        .then(([postedComment]) => {
            return postedComment;
    })
}

const selectCommentsByArticleId = (article_id, sorted_by = 'created_at', order = 'desc', limit = 10, page = 1) => {
    const limitRegex = /\D/;
    if (limitRegex.test(limit) || limitRegex.test(page)) throw ({status: 422, msg: 'A valid integer must be provided'})
    if (order !== 'asc' && order !== 'desc') throw ({ status: 400, msg: 'invalid order' });
    else return selectArticleById(article_id)
        .then((articles) => {
            if (!articles) throw ({ status: 404, msg: 'article does not exist' });
            else return connection
                .select('comment_id', 'votes', 'created_at', 'author', 'body')
                .from('comments')
                .where({ article_id })
                .orderBy(sorted_by, order)
                .limit(limit)
                .offset(limit * (page - 1));
        });
}

const patchCommentVotesById = (comment_id, inc_votes) => {
    if (inc_votes === undefined) {
        throw ({ status: 400, msg: 'invalid input syntax for type' });
    }
    return connection('comments')
        .increment('votes', inc_votes)
        .where({ comment_id })
        .returning('*')
        .then(comment => {
            if (comment[0] === undefined) throw ({ status: 404, msg: 'comment not found' });
            else return comment[0];
        });
}

const deleteCommentById = (comment_id) => {
    return connection('comments')
        .del()
        .where({ comment_id })
        .then(deleteCount => {
            if (deleteCount === 0) throw ({ status: 404, msg: 'comment not found' });
        });
}


module.exports = { addNewComment, selectCommentsByArticleId, patchCommentVotesById, deleteCommentById };


