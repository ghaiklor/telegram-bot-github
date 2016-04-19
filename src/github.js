"use strict";

const GitHubApi = require('github');
const github = new GitHubApi({version: '3.0.0'});

module.exports = github;
