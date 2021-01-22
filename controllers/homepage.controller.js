const endpoints = require('../endpoints.json')
const welcome = require('../welcome.json')

exports.welcomePage = (req, res, next) => {
    res.status(200).send({ welcome });
}

exports.homepage = (req, res, next) => {
    res.status(200).send({ endpoints });
};