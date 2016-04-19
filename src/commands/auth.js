"use strict";

const User = require('../models/User');
const GitHubNotifications = require('../common/GitHubNotifications');
const MESSAGES = require('../common/messages');

module.exports = bot => {
  bot.onText(/\/auth *(.*):(.*)/, (message, match) => {
    const username = match[1];
    const token = match[2];
    const telegramId = message.from.id;

    if (!username || !token) return bot.sendMessage(telegramId, MESSAGES.USERNAME_AND_TOKEN_NOT_SPECIFIED);

    User.findOne({username, telegramId}, (error, user) => {
      if (error) return bot.sendMessage(user.telegramId, MESSAGES.SOMETHING_WENT_WRONG);

      if (!user) {
        User.create({username, token, telegramId}, (error, user) => {
          if (error) return bot.sendMessage(user.telegramId, MESSAGES.SOMETHING_WENT_WRONG);

          bot.sendMessage(telegramId, MESSAGES.REGISTER_SUCCESSFUL);
          new GitHubNotifications(user.username, user.token).on('notification', data => bot.sendMessage(user.telegramId, data));
        });
      } else {
        User.update({username, telegramId}, {token}, (error, user) => {
          if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

          bot.sendMessage(user.telegramId, MESSAGES.PERSONAL_TOKEN_UPDATED);
          new GitHubNotifications(user.username, user.token).on('notification', data => bot.sendMessage(user.telegramId, data));
        });
      }
    });
  });
};
