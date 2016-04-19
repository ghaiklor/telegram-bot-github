"use strict";

module.exports = bot => {
  bot.onText(/\/start */, message => {
    const fromId = message.from.id;
    const response = `Hey! I'm here to help you integrate your GitHub account for receiving notifications, type /help`;

    bot.sendMessage(fromId, response);
  });
};
