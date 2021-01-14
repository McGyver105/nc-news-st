const connection = require('../db/connection');

const addNewComment = (article_id, newComment) => {
    return connection('comments')
        .insert({ article_id, author: newComment['username'], body: newComment['body'] })
        .returning('*')
        .then(([postedComment]) => {
            return postedComment;
    })
}

module.exports = { addNewComment };