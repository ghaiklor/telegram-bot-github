const User = require('../models/User');
const GitHubNotifications = require('../services/GitHubNotifications');
const MESSAGES = require('../common/messages');

module.exports = bot => {
  bot.onText(/\/logout/, message => {
    const telegramId = message.from.id;

    User.findOne({telegramId}, (error, user) => {
      if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
      if (!user) return bot.sendMessage(telegramId, MESSAGES.USER_NOT_EXISTS);

      GitHubNotifications.unsubscribe(user.username);

      User.remove({telegramId}, error => {
        if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

        bot.sendMessage(telegramId, MESSAGES.ACCOUNT_UNLINKED);
      });
    });
  });
};
