const connection = require('../db/connection');

const selectUserById = (username) => {
    return connection.select('*').from('users').where({ username }).then(([user]) => {
        return user;
    })
}

module.exports = { selectUserById };