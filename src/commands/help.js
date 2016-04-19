"use strict";

/**
 * Prints help.
 *
 * @param {TelegramBot} bot
 * @returns {TelegramBot}
 */
module.exports = function (bot) {
  bot.onText(/\/help/i, (message, match) => {
    const fromId = message.from.id;

    bot.sendMessage(fromId, `
    Hey!

    Authenticate your GitHub account via /auth username:token
    Check if bot is alive by sending /ping
    `);
  });

  return bot;
};
