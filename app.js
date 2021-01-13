const express = require("express");
const { handleCustomErrors, handleSQLErrors } = require("./controllers/errors.controller");
const apiRouter = require('./routers/api.router');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', (req, res, next) => {
    res.sendStatus(404);
})

app.use(handleCustomErrors);
app.use(handleSQLErrors);
app.use((err, req, res, next) => {
    res.sendStatus(500)
})

module.exports  = app;