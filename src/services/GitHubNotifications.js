"use strict";

const EventEmitter = require('events').EventEmitter;
const request = require('request');
const winston = require('winston');

const NOTIFICATIONS_ENDPOINT = 'api.github.com/notifications';

const subscribedUsers = {};

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
    if (subscribedUsers[username] instanceof GitHubNotifications) {
      winston.log(`Found already subscribed listener for ${username} (ignore creating of the listener)`);
      return subscribedUsers[username];
    }

    winston.log(`Creating new GitHub Notifications listener for ${username}`);

    super();

    this._username = username;
    this._token = token;
    this._url = `https://${this._username}:${this._token}@${NOTIFICATIONS_ENDPOINT}`;
    this._headers = {'User-Agent': 'telegram-bot-github'};

    this._process();

    subscribedUsers[username] = this;
  }

  /**
   * Triggers each time when got response from GitHub notifications endpoint.
   *
   * @param error
   * @param response
   * @param body
   * @private
   */
  _onNotificationsResponse(error, response, body) {
    if (error) return winston.error(error);

    winston.log(`Got code ${response.statusCode} for ${this._username} when checking notifications`);

    const interval = (Number(response.headers['x-poll-interval']) || 60) * 1000;

    // if (response.statusCode === 304 || response.statusCode === 200) {
    //   this._headers['If-Modified-Since'] = response.headers.date;
    // }

    if (response.statusCode === 200) {
      body.forEach(notification => {
        const subjectUrl = notification.subject.url;
        const headers = {'User-Agent': 'telegram-bot-github'};

        winston.log(`Got new subject from notification for ${this._username}, processing...`);
        request(subjectUrl, {headers, json: true}, this._onSubjectResponse.bind(this));
      });
    }

    winston.log(`Queuing next check for ${this._username} after ${interval / 1000} seconds`);
    setTimeout(this._process.bind(this), interval);
  }

  /**
   * Triggers each time when got response from subject endpoint.
   *
   * @param error
   * @param response
   * @param body
   * @private
   */
  _onSubjectResponse(error, response, body) {
    if (error) return winston.error(error);

    if (response.statusCode === 200) {
      winston.log(`Parsed new subject HTML URI for ${this._username}, emitting...`);
      this.emit('notification', body.html_url);
    }
  }

  /**
   * Makes a request to GitHub notifications endpoint.
   *
   * @private
   */
  _process() {
    winston.log(`Checking for new notifications on GitHub for ${this._username}`);
    request(this._url, {headers: this._headers, json: true}, this._onNotificationsResponse.bind(this));
  }
}

module.exports = GitHubNotifications;
