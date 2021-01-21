const connection = require('../db/connection');

const selectAllTopics = () => {
    return connection.select('*').from('topics');
}

const insertNewTopic = (newTopic) => {
    return connection
        .insert(newTopic)
        .into('topics')
        .returning('*')
        .then(([topic]) => {
            return topic;
        });
}

module.exports = { selectAllTopics, insertNewTopic };