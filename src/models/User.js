const mongoose = require('mongoose');
const { User: UserSchema } = require('../schemas');

module.exports = mongoose.model('User', UserSchema);
