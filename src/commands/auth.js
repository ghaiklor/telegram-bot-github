"use strict";

const User = require('../models/User');
const GitHubNotifications = require('../GitHubNotifications');

/**
 * Registers new GitHub user in bot.
 *
 * @param {TelegramBot} bot
 * @returns {TelegramBot}
 */
module.exports = function (bot) {
  bot.onText(/\/auth (.*):(.*)/i, (message, match) => {
    const username = match[1];
    const token = match[2];
    const telegramId = message.from.id;

    if (!username || !token) return bot.sendMessage(telegramId, 'You should specify username and token');

    User.findByUsername(username, (error, user) => {
      if (error) return bot.sendMessage(telegramId, 'Something went wrong, try again...');

      if (!user) {
        User.create({username, token, telegramId}, (error, user) => {
          if (error) return bot.sendMessage(telegramId, 'Something went wrong, try again...');

          bot.sendMessage(telegramId, 'You successfully has been registered');
          new GitHubNotifications(username, token).on('data', data => bot.sendMessage(telegramId, data));
        });
      } else {
        User.update({username, telegramId}, {token}, (error, user) => {
          if (error) return bot.sendMessage(telegramId, 'Something went wrong, try again...');

          bot.sendMessage(telegramId, 'Your profile successfully has been updated');
        });
      }
    });
  });

  return bot;
};
