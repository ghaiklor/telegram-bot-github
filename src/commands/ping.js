"use strict";

module.exports = bot => {
  bot.onText(/\/ping *(.*)/, (message, match) => {
    const telegramId = message.from.id;
    const response = (match[1] || `I'm alive, don't worry :)`).trim();

    bot.sendMessage(telegramId, response);
  });
};
