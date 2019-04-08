module.exports = {
  SOMETHING_WENT_WRONG: `Something went wrong and I do not know how to handle this...`,
  USERNAME_NOT_SPECIFIED: `You should specify username. Try to authorize via /auth command again.`,
  GITHUB_TOKEN_NOT_SPECIFIED: `You should specify your GitHub personal token. Try to authorize via /auth command again.`,
  USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED: `You should specify your GitHub username and GitHub personal token in the format "/auth username:token"`,
  REGISTER_SUCCESSFUL: `You have successfully been registered. When you get new notifications, I will send you a message.`,
  USERNAME_ALREADY_REGISTERED: `You are already registered or you are trying to change a personal token of someone else's GitHub profile.`,
  PERSONAL_TOKEN_UPDATED: `Your personal token has successfully been updated.`,
  USER_NOT_EXISTS: `I can't find GitHub profile with this username. You can register your GitHub account via /auth command.`,
  CANT_UPDATE_PERSONAL_TOKEN: `I can't update personal token for this user. Maybe it's not your GitHub username?`,
  ACCOUNT_UNLINKED: `Your account has successfully been unlinked. You can register a new one via /auth command now.`,
  UNAUTHORIZED: `Seems that your personal token is incorrect, I can't authorize you. In order to prevent annoying messages about it, your user will be deleted from database. Update your token via /auth command if you want to continue using this bot.`
};
