exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) res.status(err.status).send({msg: err.msg})
    else next(err);
};

exports.handleSQLErrors = (err, req, res, next) => {
    const errorLookup = {
        '22P02': { status: 400, msg: 'invalid input syntax for type' },
        '23503': { status: 422, msg: 'input field does not exist' },
        '23502': { status: 422, msg: 'field missing' },
        '42703': { status: 400, msg: 'input field does not exist' }
    };
    if (err.code) res.status(errorLookup[err.code].status).send({msg: errorLookup[err.code].msg});
    else next(err);
}

exports.handleIncorrectPaths = (req, res, next) => {
    res.sendStatus(500);
}

exports.catchRemainingErrors = (err, req, res, next) => {
    res.sendStatus(500);
};