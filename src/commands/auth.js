"use strict";

const User = require('../models/User');

/**
 * Registers new GitHub user in bot.
 *
 * @param {TelegramBot} bot
 * @returns {TelegramBot}
 */
module.exports = function (bot) {
  bot.on(/\/auth (.*):(.*)/i, (message, match) => {
    const username = match[1];
    const token = match[2];
    const telegramId = message.from.id;

    if (!username || !token) return bot.sendMessage(telegramId, 'You should specify username and token');

    new User({username, token, telegramId}).save(error => {
      if (error) return bot.sendMessage(telegramId, 'Something went wrong, try again...');

      bot.sendMessage(telegramId, 'You successfully has been registered');
    });
  });

  return bot;
};
