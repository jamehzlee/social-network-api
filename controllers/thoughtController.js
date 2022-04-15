const { Thought, User } = require('../models');

const reactionCount = async () =>
  Thought.aggregate()
    .count('reactionCount')
    .then((numberOfReactions) => numberOfReactions);

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
        !newThought
          ? res.status(404).json({ message: 'No Thought with that ID' })
          : res.json({
              newThought,
              reactions: await reactionCount(req.params.thoughtId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  createThought(req, res) {
    Thought.insertMany(req.body)
      
      .then((newThought) => res.json(newThought))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true },
    )
      .then((newThought) => 
        !newThought
          ? res.status(404).json({message: 'No thought with that id found'})
          : res.json(newThought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((newThought) =>
        !newThought
          ? res.status(404).json({ message: 'No such Thought exists' })
          : res.json({ message: 'Thought successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // createReaction(req, res) {
  //   Thought.findOneAndUpdate(
  //     { _id: req.params.thoughtId },
  //     { $set: req.body },
  //     { runValidators: true, new: true },
  //   )
  //     .then((newThought) => 
  //       !newThought
  //         ? res.status(404).json({message: 'No thought with that id found'})
  //         : res.json(newThought)
  //     )
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(500).json(err);
  //     })
  // },

  // deleteReaction(req, res) {
  //   Thought.findOneAndRemove({ _id: req.params.thoughtId })
  //     .then((newThought) =>
  //       !newThought
  //         ? res.status(404).json({ message: 'No such Thought exists' })
  //         : res.json({ message: 'Thought successfully deleted' })
  //     )
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(500).json(err);
  //     });
  // },
};
