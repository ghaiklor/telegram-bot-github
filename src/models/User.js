"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  token: String,
  telegramId: String
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
