module.exports = bot => {
  bot.onText(/\/start/, message => {
    const fromId = message.from.id;
    const response = `Hey! I'm here to help you integrate your GitHub account to receive notifications. Type /help to get started.`;

    bot.sendMessage(fromId, response);
  });
};
