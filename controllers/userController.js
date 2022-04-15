const { User, } = require('../models');

module.exports = {

  getUsers(req, res) {
    User
    .find()
    .select('-__v')
    .then((user) => 
    res.json({
      user
      
    }),
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  },

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .populate('thoughts')
    .populate('friends')
    .select('-__v')
      .then((user) =>
        user
          ? res.json({
            thoughts: user.thoughts,
            friends: user.friends,
            _id: user._id,
            username: user.username,
            email: user.email,
            friendCount: user.friendCount,
          })
          : res.status(404).json({ message: 'No user with that ID found' })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  createUser(req, res) {
    User.create(req.body)
      .then((User) => res.json(User))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err)
      });
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true },
    )
      .then((user) => 
        user
          ? res.json(user)
          : res.status(404).json({message: 'No user with that id found'})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
  },

  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((User) =>
        User
          ? res.json({ message: 'User successfully deleted.' })
          : res.status(404).json({ message: 'No user with that ID found.' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { runValidators: true, new: true })
      .then((user) => 
      user
        ? res.status(200).json(user)
        : res.status(404).json({message: 'No friend with that id found.'})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
    ;
  },

  deleteFriend(req, res) {
    User
      .findOneAndUpdate(
        { 
          _id: req.params.userId, 
          $pull: { friends: req.params.friendId },
          new: true,
          
        })
      .then((user) =>
        user
          ? res.json({ message: 'Friend successfully removed.' })
          : res.status(404).json({ message: 'No friend with that ID exists.' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};