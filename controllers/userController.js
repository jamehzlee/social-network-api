const { User } = require('../models');

const friendCount = async () => 
  User.aggregate()
    .count('friendCount')
    .then((numberOfFriends) => numberOfFriends);

module.exports = {

  getUsers(req, res) {
    User.find().select('-__v')
    .then((users) => res.json(users))
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  },

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (User) =>
        !User
          ? res.status(404).json({ message: 'No User with that ID' })
          : res.json({
              User,
              friends: await friendCount(req.params.userId),
            })
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
        !user
          ? res.status(404).json({message: 'No user with that id found'})
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
  },

  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((User) =>
        !User
          ? res.status(404).json({ message: 'No such User exists.' })
          : res.json({ message: 'User successfully deleted.' })
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
        ? res.status(200).json({message: 'Friend successfully added.'})
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
          ? res.json({ message: 'Friend successfully deleted.' })
          : res.status(404).json({ message: 'No such Friend exists.' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
