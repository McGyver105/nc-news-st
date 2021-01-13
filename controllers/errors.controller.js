exports.handleCustomErrors = (err, req, res, next) => {
    if (err === 'no user found') res.status(404).send({ msg: 'invalid username' })
    if (err.status && err.msg) res.status(err.status).send(err.msg)
    else next(err);
};

exports.handleSQLErrors = (err, req, res, next) => {
    if (err.code === '22P02') res.status(404).send({ msg: 'invalid username' });
    else next(err);
}