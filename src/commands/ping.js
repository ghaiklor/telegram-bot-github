"use strict";

/**
 * Check if bot is alive by sending ping command.
 *
 * @param {TelegramBot} bot
 * @returns {TelegramBot}
 */
module.exports = function (bot) {
  bot.onText(/\/ping(.*)/i, (msg, match) => bot.sendMessage(msg.from.id, match[1] || 'pong'));
  return bot;
};
