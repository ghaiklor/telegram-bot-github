"use strict";

const github = require('../github');

/**
 * Responds with your followers or followers of the specified user.
 *
 * @param {TelegramBot} bot
 * @returns {TelegramBot}
 */
module.exports = function (bot) {
  bot.on(/\/followers(.*)/i, (msg, match) => {
    const username = (match[1] || 'ghaiklor').trim();

    bot.sendMessage(msg.from.id, 'Looking...');

    github.user.getFollowers({user: username}, (error, response) => {
      if (error) return bot.sendMessage(msg.from.id, 'Something went wrong, try again...');

      bot.sendMessage(msg.from.id, JSON.stringify(response));
    });
  });

  return bot;
};
