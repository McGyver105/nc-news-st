const express = require("express");
const apiRouter = require('./routers/api.router');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
    res.sendStatus(404);
})

module.exports  = app;