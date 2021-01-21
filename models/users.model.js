const connection = require('../db/connection');

const selectAllUsers = () => {
    return connection
        .select('*')
        .from('users');
}

const insertNewUser = (newUser) => {
    return connection
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(([user]) => {
            return user;
    })
}

const selectUserById = (username) => {
    const usernameRegex = /[A-z]+/;
    if (usernameRegex.test(username) === false) {
        throw ({status: 400, msg: 'invalid username'})
    }
    return connection
        .select('*')
        .from('users')
        .where({ username })
        .then(([user]) => {
            if (user === undefined) {
                throw ({ status: 404, msg: 'user not found' });
            }
            else return user;
        });
}

module.exports = { selectUserById, selectAllUsers, insertNewUser };