exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) res.status(err.status).send({msg: err.msg})
    else next(err);
};

exports.handleSQLErrors = (err, req, res, next) => {
    if (err.code === '22P02') res.status(400).send({ msg: 'invalid input syntax for type' });
    if (err.code === '23503') res.status(422).send({ msg: 'input field does not exist' });
    if (err.code === '23502') res.status(422).send({ msg: 'field missing' });
    if (err.code === '42703') res.status(400).send({ msg: 'input field does not exist' });
    else next(err);
}