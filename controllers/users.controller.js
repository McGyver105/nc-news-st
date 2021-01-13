const { selectUserById } = require('../models/users.model');

exports.getUserById = (req, res, next) => {
    const { user } = req.params;
    selectUserById(user).then((username) => {
        if (username.length === 0) throw 'no user found';
        else res.status(200).send({ username });
    })
        .catch(err => {
            next(err);
    })
}