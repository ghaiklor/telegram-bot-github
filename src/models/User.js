const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, unique: true, required: true, dropDups: true},
  token: {type: String, required: true},
  telegramId: {type: String, unique: true, required: true, dropDups: true}
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
