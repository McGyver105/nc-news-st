const { changeTimeStamp, formatDataTimeStamp, createArticlesLookup, formatArticlesData } = require('../utils/data-manipulation');

const {
  topicsData,
  articlesData,
  commentsData,
  usersData,
} = require('../data/index.js');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics').insert(topicsData);
    })
    .then(() => {
      return knex('users').insert(usersData);
    })
    .then(() => {
      const formattedArticles = formatDataTimeStamp(articlesData, changeTimeStamp);
      return knex('articles').insert(formattedArticles).returning("*");
    })
    .then((response) => {
      const articleLookup = createArticlesLookup(response);
      const formattedComments = formatArticlesData(commentsData, articleLookup);
      return knex('comments').insert(formattedComments).returning('*');
    })
    // for comments data, need to convert belongs to article id
    //created by is author
    //created at is timestamp
};
