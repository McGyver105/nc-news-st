const { changeTimeStamp, formatDataTimeStamp } = require('../utils/data-manipulation');

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
      console.log(response);
      const articleLookup = createArticlesLookup(response);
    })
    // for comments data, need to convert belongs to article id
    //created by is author
    //created at is timestamp
};
