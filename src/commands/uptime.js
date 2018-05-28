const moment = require('moment');
const startTime = moment();

module.exports = bot => {
  bot.onText(/\/uptime/, message => {
    const fromId = message.from.id;
    const response = `Uptime: ${startTime.from(moment(), true)}`;

    return bot.sendMessage(fromId, response);
  });
};
