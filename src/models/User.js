"use strict";

const mongoose = require('mongoose');

const User = mongoose.model('User', {
  username: String,
  token: String,
  telegramId: String
});

module.exports = User;
