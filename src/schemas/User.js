const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },

  telegramId: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },

  token: {
    type: String,
    required: true
  },

  notifiedSince: {
    type: Date,
    default: () => new Date(0)
  }
});

module.exports = User;
