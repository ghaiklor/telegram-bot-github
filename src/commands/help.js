module.exports = bot => {
  bot.onText(/\/help/, message => {
    const fromId = message.from.id;
    const response = `
Hi!

I'm here to notify you when something interesting happens on your GitHub profile. Although, you will need to tell me your username and personal token for me to do that.

If you don't know how to generate your personal token, follow this link - https://help.github.com/articles/creating-an-access-token-for-command-line-use/.

Your personal token must have 'repo' and 'notifications' scope, otherwise, I can't guarantee that I can notify you.
After you generate your personal token, call me via /auth username:token command, thanks.
    `;

    bot.sendMessage(fromId, response);
  });
};
