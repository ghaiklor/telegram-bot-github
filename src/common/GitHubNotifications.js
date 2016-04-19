"use strict";

const EventEmitter = require('events').EventEmitter;
const request = require('request');

const NOTIFICATIONS_ENDPOINT = 'api.github.com/notifications';

/**
 * It responsible for getting user's notifications and emitting data event with them.
 *
 * @extends {EventEmitter}
 */
class GitHubNotifications extends EventEmitter {
  /**
   * Creates new EventEmitter which will notify about new notifications on GitHub.
   *
   * @constructor
   * @param {String} username GitHub username
   * @param {String} token Personal access token of GitHub profile
   */
  constructor(username, token) {
    super();

    this._username = username;
    this._token = token;
    this._url = `https://${this._username}:${this._token}@${NOTIFICATIONS_ENDPOINT}`;
    this._headers = {'User-Agent': 'telegram-bot-github'};

    this._request();
  }

  /**
   * Triggers each time when got response from GitHub endpoint.
   *
   * @param error
   * @param response
   * @param body
   * @private
   */
  _onResponse(error, response, body) {
    if (error) return console.error(error);

    const interval = (Number(response.headers['x-poll-interval']) || 60) * 1000;

    if (response.statusCode === 304 || response.statusCode === 200) {
      this._headers['If-Modified-Since'] = response.headers.date;
    }

    if (response.statusCode === 200) {
      body.forEach(notification => {
        const subjectUrl = notification.subject.url;

        request(subjectUrl, {headers: {'User-Agent': 'telegram-bot-github'}, json: true}, (error, response, body) => {
          if (error) return console.error(error);

          if (response.statusCode === 200) {
            this.emit('notification', this._parseNotification(body));
          }
        });
      });
    }

    setTimeout(this._request.bind(this), interval);
  }

  /**
   * Makes a request to GitHub notifications endpoint.
   *
   * @private
   */
  _request() {
    request(this._url, {headers: this._headers, json: true}, this._onResponse.bind(this));
  }

  /**
   * Parses notification and build readable message.
   *
   * @param {Object} notification
   * @private
   */
  _parseNotification(notification) {
    return notification.html_url;
  }
}

module.exports = GitHubNotifications;
