const express = require('express');
const topicsRouter = express.Router();
const { getAllTopics, addTopic } = require('../controllers/topics.controller');

topicsRouter.route('/').get(getAllTopics).post(addTopic);

module.exports = topicsRouter;