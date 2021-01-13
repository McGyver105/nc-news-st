const connection = require('../db/connection');

const selectArticleById = (article_id) => {
    return connection
        .select('*')
        .from('articles')
        .where({ 'articles.article_id': article_id })
        .then(([article]) => {
            return article;
        })
}

const addCommentCount = (article, article_id) => {
    return connection
        .select('*')
        .from('articles')
        .join('comments', 'articles.article_id', '=', 'comments.article_id')
        .where({ 'articles.article_id': article_id })
        .then((joinedTables) => {
            const newArticleObj = article;
            newArticleObj.comment_count = joinedTables.length;
            return newArticleObj;
    })
}

module.exports = { selectArticleById, addCommentCount };