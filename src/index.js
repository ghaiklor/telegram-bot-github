"use strict";

const mongoose = require('mongoose');
const requireAll = require('require-all');
const TelegramBot = require('node-telegram-bot-api');
const GitHubNotifications = require('./GitHubNotifications');

const BOT_COMMANDS = requireAll({dirname: `${__dirname}/commands`});
const TELEGRAM_BOT_TOKEN = process.env['TELEGRAM_BOT_TOKEN'];

mongoose.connect(process.env['MONGODB_URI']);

if (!TELEGRAM_BOT_TOKEN) throw new Error('You must provide telegram bot token');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});

Object.keys(BOT_COMMANDS).forEach(command => BOT_COMMANDS[command](bot));
