const connection = require('../db/connection');
const articlesRouter = require('../routers/articles.router');

const addNewComment = (article_id, newComment) => {
    return connection('comments')
        .insert({ article_id, author: newComment['username'], body: newComment['body'] })
        .returning('*')
        .then(([postedComment]) => {
            return postedComment;
    })
}

const selectCommentsByArticleId = (article_id) => {
    return connection
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .from('comments')
        .where({ article_id });
}

module.exports = { addNewComment, selectCommentsByArticleId };