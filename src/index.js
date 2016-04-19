"use strict";

const requireAll = require('require-all');
const TelegramBot = require('node-telegram-bot-api');

const BOT_COMMANDS = requireAll({dirname: `${__dirname}/commands`});
const TELEGRAM_BOT_TOKEN = process.env['TELEGRAM_BOT_TOKEN'];

if (!TELEGRAM_BOT_TOKEN) throw new Error('You must provide telegram bot token');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});

Object.keys(BOT_COMMANDS).forEach(command => BOT_COMMANDS[command](bot));
