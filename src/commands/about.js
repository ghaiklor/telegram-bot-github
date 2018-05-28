module.exports = bot => {
  bot.onText(/\/about/, message => {
    const fromId = message.from.id;
    const response = `
Developer - Eugene Obrezkov aka ghaiklor.

Follow me on Twitter - https://twitter.com/ghaiklor.
Follow me on GitHub - https://github.com/ghaiklor.

You can report issues directly to me via Twitter and I'll respond as soon as possible, thanks.
`;

    return bot.sendMessage(fromId, response);
  });
};
