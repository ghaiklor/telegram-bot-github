const User = require('../models/User');
const MESSAGES = require('../common/messages');

module.exports = bot => {
  bot.onText(/\/logout/, message => {
    const telegramId = message.from.id;

    User.findOne({ telegramId }, (error, user) => {
      if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
      if (!user) return bot.sendMessage(telegramId, MESSAGES.USER_NOT_EXISTS);

      User.remove({ telegramId }, error => {
        if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

        return bot.sendMessage(telegramId, MESSAGES.ACCOUNT_UNLINKED);
      });
    });
  });
};
