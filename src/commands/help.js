"use strict";

module.exports = bot => {
  bot.onText(/\/help */, message => {
    const fromId = message.from.id;

    bot.sendMessage(fromId, `
    Hey!
    
    I'm here to notify you when something interesting happens on your GitHub profile.
    Though, you need to tell me your username and personal token, so I can follow your profile.
    
    If you don't know how to generate your personal token, follow this link - https://help.github.com/articles/creating-an-access-token-for-command-line-use/.
    Your personal token must have repo and notifications scope, otherwise, I can't guarantee that I can notify you.
    When you will generate your personal token, call me via /auth username:token command, thanks.
    
    Also, you can control me with these commands:
    
    /auth - authenticate yourself with username and personal token
    /ping - just checks if I'm alive
    `);
  });
};
