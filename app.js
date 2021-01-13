const express = require("express");
const { handleCustomErrors } = require("./controllers/errors.controller");
const apiRouter = require('./routers/api.router');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.all('/*', (req, res, next) => {
    res.sendStatus(404);
})

module.exports  = app;