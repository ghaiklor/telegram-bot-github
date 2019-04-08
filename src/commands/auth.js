const { User } = require('../models');
const { GitHubNotification } = require('../services');
const { MESSAGES } = require('../common');

module.exports = bot => {
  bot.onText(/\/auth (.*):(.*)|\/auth/, (message, match) => {
    const username = match[1] && match[1].split('@')[0];
    const token = match[2];
    const telegramId = message.from.id;

    if (!username && !token) return bot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
    if (!username) return bot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
    if (!token) return bot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);

    User.findOne({ username, telegramId }, (error, user) => {
      if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

      if (!user) {
        User.create({ username, token, telegramId }, error => {
          if (error && error.code == '11000') return bot.sendMessage(telegramId, MESSAGES.USERNAME_ALREADY_REGISTERED);
          if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

          new GitHubNotification(username, token, new Date(0))
            .on('notification', notification => bot.sendMessage(telegramId, notification))
            .once('unauthorized', () => bot.sendMessage(telegramId, MESSAGES.UNAUTHORIZED));

          return bot.sendMessage(telegramId, MESSAGES.REGISTER_SUCCESSFUL);
        });
      } else {
        User.update({ username, telegramId }, { token }, error => {
          if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

          new GitHubNotification(username, token, user.notifiedSince)
            .on('notification', notification => bot.sendMessage(telegramId, notification))
            .once('unauthorized', () => bot.sendMessage(telegramId, MESSAGES.UNAUTHORIZED));

          return bot.sendMessage(telegramId, MESSAGES.PERSONAL_TOKEN_UPDATED);
        });
      }
    });
  });
};
