"use strict";

const User = require('../models/User');
const MESSAGES = require('../common/messages');

module.exports = bot => {
  bot.onText(/\/logout/, message => {
    const telegramId = message.from.id;

    User.remove({telegramId}, error => {
      if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

      bot.sendMessage(telegramId, MESSAGES.ACCOUNT_UNLINKED);
    });
  });
};
