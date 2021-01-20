const endpoints = require('../endpoints.json')

exports.homepage = (req, res, next) => {
    res.status(200).send({ endpoints });
};