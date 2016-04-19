"use strict";

const Readable = require('stream').Readable;
const request = require('request');

const NOTIFICATIONS_ENDPOINT = 'api.github.com/notifications';

class GitHubNotifications extends Readable {
  constructor(username, token) {
    super({objectMode: true});

    this._username = username;
    this._token = token;

    this._interval = 1;
    this._paused = false;
    this._timeout = null;
    this._headers = {
      'User-Agent': 'telegram-bot-github'
    }
  }

  _read() {
    this._paused = false;
    this.requestOnce();
  }

  destroy() {
    clearTimeout(self._timeout);
  }

  requestOnce() {
    request
      .get(`https://${this._username}:${this._token}@${NOTIFICATIONS_ENDPOINT}`, {
        headers: this._headers,
        json: true
      }, (error, response, body) => {
        if (response.statusCode === 304 || response.statusCode === 200) {
          this._headers['If-Modified-Since'] = response.headers.date;
          this._interval = Number(response.headers['x-poll-interval']);
        }

        if (response.statusCode === 200) {
          body.forEach(message => {
            if (!this.push(message)) this._paused = true
          });
        }

        if (!this._paused) this._timeout = setTimeout(this.requestOnce.bind(this), this._interval * 1000);
      });
  }
}

module.exports = GitHubNotifications;
