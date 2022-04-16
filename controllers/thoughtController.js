const { Thought, User } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {

  getThoughts(req, res) {
    Thought.find().select('-__v')
      .then((newThoughts) => res.json(newThoughts))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(async (newThought) =>
        newThought
          ? res.json({
            newThought,
          })
          : res.status(404).json({ message: 'No Thought with that ID' })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  createThought(req, res) {
    Thought
      .create(req.body)
      .then((user) => 
        User
          .findOneAndUpdate(
            { _id: req.body.userId},
            { $push: {thoughts: user} },
            console.log(user)
          )
          .select('-__v')
          .then((user) => 
            user
            ? res.json(user)
            : res.status(404).json({message: `User ID not found`})
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          })
        )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true },
    )
    .then((newThought) => 
      newThought
        ? res.json(newThought)
        : res.status(404).json({message: 'No thought with that id found'})
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((newThought) =>
        newThought
          ? res.json({ message: 'Thought successfully deleted' })
          : res.status(404).json({ message: 'No such Thought exists' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  createReaction(req, res) {
    Thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { reactions: req.body},
        { runValidators: true, new: true },
      )
      .then((newReaction) => 
        newReaction
          ? res.json(newReaction)
          : res.status(404).json({message: 'No reaction with that id found'})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
  },

  deleteReaction(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((newReaction) =>
        newReaction
          ? res.json({ message: 'Reaction successfully deleted' })
          : res.status(404).json({ message: 'No such Reaction exists' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
