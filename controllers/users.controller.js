const { selectUserById, selectAllUsers, insertNewUser } = require('../models/users.model');

exports.fetchAllUsers = (req, res, next) => {
    selectAllUsers()
        .then(users => {
            res.status(200).send({ users });
        })
        .catch(next);
}

exports.addNewUser = (req, res, next) => {
    const newUser = req.body;
    insertNewUser(newUser)
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch(next);
}

exports.getUserById = (req, res, next) => {
    const { username } = req.params;
    selectUserById(username).then((user) => {
        res.status(200).send({ user });
    })
        .catch(next);
}