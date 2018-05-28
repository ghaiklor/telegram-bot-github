module.exports = bot => {
  bot.onText(/\/ping/, message => {
    const fromId = message.from.id;
    const response = `I'm alive, don't worry :)`;

    return bot.sendMessage(fromId, response);
  });
};
