"use strict";

const mongoose = require('mongoose');
const requireAll = require('require-all');
const TelegramBot = require('node-telegram-bot-api');
const GitHubNotifications = require('./GitHubNotifications');

const BOT_COMMANDS = requireAll({dirname: `${__dirname}/commands`});
const TELEGRAM_BOT_TOKEN = process.env['TELEGRAM_BOT_TOKEN'];

if (!TELEGRAM_BOT_TOKEN) throw new Error('You must provide telegram bot token');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});

Object.keys(BOT_COMMANDS).forEach(command => BOT_COMMANDS[command](bot));

mongoose.connect(process.env['MONGODB_URI']);
const User = require('./models/User');
User.find({}, (error, users) => {
  if (error) throw new Error(error);

  users.forEach(user => {
    new GitHubNotifications(user.username, user.token).on('data', data => {
      bot.sendMessage(user.telegramId, data.repository.html_url);
    });
  });
});
