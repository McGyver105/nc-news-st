const connection = require('../db/connection');

const selectAllTopics = () => {
    return connection.select('*').from('topics');
}

module.exports = { selectAllTopics };