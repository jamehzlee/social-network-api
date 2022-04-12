const { Schema, model } = require('mongoose');
// const assignmentSchema = require('./Assignment');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please use a valid email'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],  
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],  
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema
  .virtual('friendCount')
  .get(function () {
    return `${friends.length}`;
  });

const User = model('user', userSchema);

module.exports = User;
