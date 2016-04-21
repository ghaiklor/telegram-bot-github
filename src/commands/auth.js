"use strict";

const User = require('../models/User');
const GitHubNotifications = require('../services/GitHubNotifications');
const MESSAGES = require('../common/messages');

module.exports = bot => {
  bot.onText(/\/auth (.*):(.*)|\/auth/, (message, match) => {
    const username = match[1] && match[1].split('@')[0];
    const token = match[2];
    const telegramId = message.from.id;

    if (!username && !token) return bot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
    if (!username) return bot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
    if (!token) return bot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);

    User.findOne({username, telegramId}, (error, user) => {
      if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

      if (!user) {
        User.create({username, token, telegramId}, (error, user) => {
          if (error && error.code == '11000') return bot.sendMessage(telegramId, MESSAGES.USERNAME_ALREADY_REGISTERED);
          if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

          bot.sendMessage(telegramId, MESSAGES.REGISTER_SUCCESSFUL);
          new GitHubNotifications(user.username, user.token).on('notification', data => bot.sendMessage(telegramId, data));
        });
      } else {
        User.update({username, telegramId}, {token}, (error, user) => {
          if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

          bot.sendMessage(telegramId, MESSAGES.PERSONAL_TOKEN_UPDATED);
          new GitHubNotifications(user.username, user.token).on('notification', data => bot.sendMessage(telegramId, data));
        });
      }
    });
  });
};
