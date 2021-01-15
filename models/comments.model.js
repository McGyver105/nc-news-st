const connection = require('../db/connection');
const articlesRouter = require('../routers/articles.router');
const { selectArticleById } = require('./articles.model');

const addNewComment = (article_id, newComment) => {
    return connection('comments')
        .insert({ article_id, author: newComment['username'], body: newComment['body'] })
        .returning('*')
        .then(([postedComment]) => {
            return postedComment;
    })
}

const selectCommentsByArticleId = (article_id, sorted_by = 'created_at', order = 'desc') => {
    if (order !== 'asc' && order !== 'desc') throw ({status: 400, msg: 'invalid order'})
    else return selectArticleById(article_id)
        .then((articles) => {
            if (!articles) throw ({ status: 404, msg: 'article does not exist' })
            else return connection
            .select('comment_id', 'votes', 'created_at', 'author', 'body')
            .from('comments')
            .where({ article_id })
            .orderBy(sorted_by, order)
        })

/*
    
*/
}

const patchCommentVotesById = (comment_id, inc_votes = 0) => {
    return connection('comments')
        .increment('votes', inc_votes)
        .where({ comment_id })
        .returning('*')
        .then(comment => comment[0]);
}

const deleteCommentById = (comment_id) => {
    return connection('comments')
        .del()
        .where({ comment_id });
}


module.exports = { addNewComment, selectCommentsByArticleId, patchCommentVotesById, deleteCommentById };


