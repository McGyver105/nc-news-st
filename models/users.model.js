const connection = require('../db/connection');

const selectAllUsers = () => {
    return connection
        .select('*')
        .from('users');
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

module.exports = { selectUserById, selectAllUsers };