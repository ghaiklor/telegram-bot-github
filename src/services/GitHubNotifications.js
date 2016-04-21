"use strict";

const EventEmitter = require('events').EventEmitter;
const request = require('request');

const NOTIFICATIONS_ENDPOINT = 'api.github.com/notifications';

const subscribedUsers = {};

class GitHubNotifications extends EventEmitter {
  constructor(username, token) {
    if (subscribedUsers[username] instanceof GitHubNotifications) return subscribedUsers[username];

    super();

    this._username = username;
    this._token = token;
    this._url = `https://${this._username}:${this._token}@${NOTIFICATIONS_ENDPOINT}`;
    this._headers = {'User-Agent': 'telegram-bot-github'};
    this._timeout = null;

    this._process();

    subscribedUsers[username] = this;
  }

  _onNotificationsResponse(error, response, body) {
    if (error) return console.error(error);

    if (response.statusCode === 401) {
      this.emit('unauthorized');
      return GitHubNotifications.unsubscribe(this._username);
    }

    const interval = (Number(response.headers['X-Poll-Interval']) || 60) * 1000;

    if (response.statusCode === 304 || response.statusCode === 200) {
      this._headers['If-Modified-Since'] = response.headers.date;
    }

    if (response.statusCode === 200) {
      body.forEach(notification => {
        const subjectUrl = notification.subject.url;
        const headers = {'User-Agent': 'telegram-bot-github'};

        request(subjectUrl, {headers, json: true}, this._onSubjectResponse.bind(this));
      });
    }

    this._timeout = setTimeout(this._process.bind(this), interval);
  }

  _onSubjectResponse(error, response, body) {
    if (error) return console.error(error);

    if (response.statusCode === 200) {
      this.emit('notification', body.html_url);
    }
  }

  _process() {
    request(this._url, {headers: this._headers, json: true}, this._onNotificationsResponse.bind(this));
  }

  static subscribe(username, token) {
    console.log(`Subscribe new user: ${username}`);
    return new this(username, token);
  }

  static unsubscribe(username) {
    console.log(`Unsubscribe user: ${username}`);
    clearTimeout(subscribedUsers[username] && subscribedUsers[username]._timeout);
    delete subscribedUsers[username];
  }
}

module.exports = GitHubNotifications;
