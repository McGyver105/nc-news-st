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
            if (article === undefined) {
                throw ({ status: 404, msg: 'article not found' });
            }
            else return article;
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
        .where({ article_id })
        .then(deleteCount => {
            if (deleteCount === 0) throw ({ status: 404, msg: 'article not found' });
        });
}

const selectAllArticles = (sorted_by = 'created_at', order = 'desc', author, topic, limit = 10, page = 1) => {
    const limitRegex = /\D/;
    if (limitRegex.test(limit) || limitRegex.test(page)) throw ({status: 422, msg: 'A valid integer must be provided'})
    if (order !== 'asc' && order !== 'desc') throw ({ status: 400, msg: 'input field invalid' });
    else return connection
        .select('articles.*')
        .count('comment_id AS comment_count')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id')
        .orderBy(sorted_by, order)
        .limit(limit)
        .offset(limit * (page - 1))
        .modify(query => {
            if (author) query.where('articles.author', author);
            if (topic) query.where('articles.topic', topic);
        })
        .then(articlesRows => {
            if (author) {
                const invalidAuthor = checkAuthorInvalid(author);
                return Promise.all([articlesRows, invalidAuthor])
            } else {
                if (topic) {
                    const invalidTopic = checkTopicInvalid(topic);
                    return Promise.all([articlesRows, invalidTopic])
                } else {
                    return [articlesRows]
                }
            }
        })
        .then(([articles, invalidSearch]) => {
            if (invalidSearch) throw ({status: 400, msg: 'invalid search term'})
            else return articles;
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

const incVoteById = (article_id, inc_votes) => {
    if (inc_votes === undefined) throw ({status: 400, msg: 'invalid input syntax for type'})
    else return connection('articles')
        .increment('votes', inc_votes)
        .where({article_id})
        .returning('*')
        .then(([article]) => {
            if (article === undefined) {
                throw ({ status: 404, msg: 'article not found' })
            }
            else return article;
        })
}

const checkAuthorInvalid = (author) => {
    return connection
        .select('*')
        .from('users')
        .where('username', '=', author)
        .then(userRows => {
            if (userRows.length === 0) return true;
            else return false;
        });
}

const checkTopicInvalid = (topic) => {
    return connection
        .select('*')
        .from('topics')
        .where('slug', '=', topic)
        .then(userRows => {
            if (userRows.length === 0) return true;
            else return false;
        });
}

module.exports = { selectArticleById, insertNewVote, removeHouseById, selectAllArticles, insertNewArticle, incVoteById };