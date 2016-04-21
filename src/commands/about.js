"use strict";

module.exports = bot => {
  bot.onText(/\/about/, message => {
    const fromId = message.from.id;

    bot.sendMessage(fromId, `
Developer - Eugene Obrezkov aka ghaiklor.

Follow me on Twitter - https://twitter.com/ghaiklor.
Follow me on GitHub - https://github.com/ghaiklor.

You can report issues directly to me in Twitter and I'll answer as soon as possible, thanks.
    `);
  });
};
