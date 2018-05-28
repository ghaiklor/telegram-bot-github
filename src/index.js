const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requireAll = require('require-all');
const TelegramBot = require('node-telegram-bot-api');
const {User} = require('./models');
const {MESSAGES} = require('./common');
const {GitHubNotification} = require('./services');
const BOT_COMMANDS = requireAll({dirname: `${__dirname}/commands`});
const app = express();

if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error('You must provide TELEGRAM_BOT_TOKEN');
if (!process.env.MONGODB_URI) throw new Error('You must provide MONGODB_URI');
if (!process.env.PORT) throw new Error('You must provide PORT');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: process.env.NODE_ENV !== 'production'});
Object.keys(BOT_COMMANDS).forEach(command => BOT_COMMANDS[command](bot));

app.use(bodyParser.json());
app.get(`/`, (req, res) => res.redirect('http://telegram.me/GitHubNotificationsBot'));
app.post(`/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
app.listen(process.env.PORT);

(async function init() {
  await Promise.all([
    mongoose.connect(process.env.MONGODB_URI),
    bot.setWebHook(process.env.NODE_ENV === 'production' ? `https://telegram-bot-github.herokuapp.com/${bot.token}` : '')
  ]);

  const users = await User.find({});
  users.forEach(user => new GitHubNotification(user.username, user.token, user.notifiedSince)
    .on('notification', notification => bot.sendMessage(user.telegramId, `${notification}`))
    .once('unauthorized', () => bot.sendMessage(user.telegramId, MESSAGES.UNAUTHORIZED))
  );
})();
