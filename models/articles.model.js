const connection = require('../db/connection');

const selectArticleById = (article_id) => {
    return connection
        .select('articles.*')
        .count('comment_id AS comment_count')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .where('articles.article_id', '=', article_id)
        .groupBy('articles.article_id')
        .then(([article]) => {
            return article;
        })
}


const insertNewVote = (newVote, article_id) => {
    return connection('articles')
        .update({
            'votes': newVote
        })
        .where('articles.article_id', '=', article_id)
        .returning('*')
        .then(([article]) => {
            return article;
    })
}

const removeHouseById = (article_id) => {
    return connection('articles')
        .del()
        .where({ article_id });
}

const selectAllArticles = (sorted_by = 'created_at', order = 'desc', author, topic) => {
    if (order !== 'asc' && order !== 'desc') throw ({ status: 400, msg: 'input field invalid' });
    else return connection
        .select('articles.*')
        .count('comment_id AS comment_count')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id')
        .orderBy(sorted_by, order)
        .modify(query => {
            if (author) query.where('articles.author', author);
        })
        .modify(query => {
            if (topic) query.where('articles.topic', topic);
        })
}

const insertNewArticle = (articleInfo) => {
    return connection
        .insert(articleInfo)
        .into('articles')
        .returning('*')
        .then(([createdArticle]) => {
            return createdArticle;
        });
}

module.exports = { selectArticleById, insertNewVote, removeHouseById, selectAllArticles, insertNewArticle };