exports.handleCustomErrors = (err, req, res, next) => {
    if (err === 'no user found') res.status(404).send({ msg: 'invalid username' });
    else next(err);
};