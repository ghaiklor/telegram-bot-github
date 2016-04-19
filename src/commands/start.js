"use strict";

module.exports = function (bot) {
  bot.onText(/\/start/i, (message, match) => {
    const fromId = message.from.id;

    bot.sendMessage(fromId, `Hey! I'm here to help you integrate your GitHub account for receiving notifications, type /help`);
  });

  return bot;
};
