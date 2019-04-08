const logger = require('winston');
const EventEmitter = require('events').EventEmitter;
const request = require('request-promise-native');
const { URL } = require('url');
const { User } = require('../models');

/**
 * Implement notifier for GitHub Notification API
 *
 * @class
 * @extends {EventEmitter}
 */
class GitHubNotification extends EventEmitter {
  /**
   * Creates new instance for watching notifications.
   *
   * @param {String} username GitHub Username
   * @param {String} token GitHub Personal Token
   * @param {Date} notifiedSince Starting from when accept notification as new
   */
  constructor(username, token, notifiedSince) {
    super();

    this._username = username;
    this._token = token;
    this._notifiedSince = notifiedSince;
    this._headers = { 'User-Agent': 'telegram-bot-github', 'If-Modified-Since': this._notifiedSince };

    this.process();
  }

  /**
   * Mapper for notification struct.
   *
   * @param {Object} notification
   * @returns {Promise<void>}
   */
  async onNotification(notification = {}) {
    // Check if notification is already read by the user
    if (!notification.unread) return;

    // Check if subject is present in notification
    const subject = notification.subject;
    if (!subject) return;

    // Get required fields from subject
    const { title, url, latest_comment_url: latestCommentUrl, type } = subject;

    // Skip if there are no urls at all
    if (!latestCommentUrl && !url) return;

    const subjectUrl = GitHubNotification.buildAuthUrl(this._username, this._token, latestCommentUrl || url);

    try {
      const response = await request(subjectUrl, {
        headers: { 'User-Agent': 'telegram-bot-github' },
        json: true,
        resolveWithFullResponse: true
      });
      const { body } = response;
      const message = `You got an update in ${title} [${type}]\nLink: ${body.html_url}`;

      this.emit('notification', message);
    } catch (_) {
      // We do not need this for now
    }
  }

  /**
   * Starts a cycle of pooling to GitHub API.
   */
  async process() {
    const url = GitHubNotification.buildAuthUrl(this._username, this._token, 'https://api.github.com/notifications');

    try {
      const response = await request(url, { headers: this._headers, json: true, resolveWithFullResponse: true });
      const { headers, body } = response;
      const interval = (Number(headers['X-Poll-Interval']) || 60) * 1000;
      const notifiedSince = headers.date || new Date();

      this._notifiedSince = notifiedSince;
      this._headers['If-Modified-Since'] = notifiedSince;
      await User.findOneAndUpdate({ username: this._username }, { notifiedSince: notifiedSince });

      body.map(this.onNotification.bind(this));
      setTimeout(this.process.bind(this), interval);
    } catch (e) {
      const statusCode = e.statusCode;
      const headers = e.response && e.response.headers;

      if (statusCode === 401) {
        this.emit('unauthorized');

        logger.error(`${this._username} is unauthorized, removing user from database...`);
        await User.remove({ username: this._username });
      }

      if (statusCode === 304) {
        const interval = (Number(headers['X-Poll-Interval']) || 60) * 1000;
        const notifiedSince = headers.date || new Date();

        this._notifiedSince = notifiedSince;
        this._headers['If-Modified-Since'] = notifiedSince;
        await User.findOneAndUpdate({ username: this._username }, { notifiedSince: notifiedSince });

        setTimeout(this.process.bind(this), interval);
      }
    }
  }

  /**
   * Builds a ready-2-use signed url with auth.
   *
   * @static
   * @param {String} username GitHub Username
   * @param {String} token GitHub Token
   * @param {String} url URL to go
   * @returns {String} URL that is ready to go into request module
   */
  static buildAuthUrl(username, token, url) {
    const parsedUrl = new URL(url);
    parsedUrl.username = username;
    parsedUrl.password = token;

    return parsedUrl.toString();
  }
}

module.exports = GitHubNotification;
