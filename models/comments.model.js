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

module.exports = { addNewComment, selectCommentsByArticleId };


/*
an articles array of article objects, each of which should have the following properties:
author which is the username from the users table
title
article_id
topic
created_at
votes
comment_count which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this
*/