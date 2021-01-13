const { selectUserById } = require('../models/users.model');

exports.getUserById = (req, res, next) => {
    const { username } = req.params;
    const usernameRegex = /[A-z]+/;
    if (usernameRegex.test(username) === false) {
        throw ({status: 400, msg: 'invalid username'})
    }
    selectUserById(username).then((user) => {
        if (user === undefined) {
            return Promise.reject({status: 404, msg: 'user not found'})
        } else {
            res.status(200).send({ user });
        }
    })
        .catch(next)
}