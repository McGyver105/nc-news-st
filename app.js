const express = require("express");
const { handleCustomErrors, handleSQLErrors, handleIncorrectPaths, catchRemainingErrors } = require("./controllers/errors.controller");
const apiRouter = require('./routers/api.router');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', handleIncorrectPaths)

app.use(handleCustomErrors);
app.use(handleSQLErrors);
app.use(catchRemainingErrors)

module.exports  = app;