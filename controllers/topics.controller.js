const { selectAllTopics, insertNewTopic } = require('../models/topics.model');

exports.getAllTopics = (req, res, next) => {
   selectAllTopics().then((topics) => {
      res.status(200).send({ topics });
   })
      .catch(next);
}

exports.addTopic = (req, res, next) => {
   const newTopic = req.body
   insertNewTopic(newTopic)
      .then((topic) => {
         res.status(200).send({ topic });
      })
      .catch(next);
}