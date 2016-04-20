"use strict";

const http = require('http');
const mongoose = require('mongoose');
const requireAll = require('require-all');
const TelegramBot = require('node-telegram-bot-api');
const GitHubNotifications = require('./common/GitHubNotifications');
const User = require('./models/User');

const BOT_COMMANDS = requireAll({dirname: `${__dirname}/commands`});
const TELEGRAM_BOT_TOKEN = process.env['TELEGRAM_BOT_TOKEN'];

if (!TELEGRAM_BOT_TOKEN) throw new Error('You must provide telegram bot token');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});

Object.keys(BOT_COMMANDS).forEach(command => BOT_COMMANDS[command](bot));

mongoose.connect(process.env['MONGODB_URI']);

User.find({}, (error, users) => {
  if (error) throw new Error(error);

  users.forEach(user => {
    new GitHubNotifications(user.username, user.token).on('notification', data => {
      bot.sendMessage(user.telegramId, `You have unread notification - ${data}`);
    });
  });
});

http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bot is working\n');
}).listen(process.env['PORT']);
