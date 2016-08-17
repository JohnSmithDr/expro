'use strict';

const _mute = () => {};

const muter = { log: _mute, debug: _mute, error: _mute };

const logger = { log: console.log, debug: console.log, error: console.error };

module.exports = process.argv.indexOf('--debug') > 0 ? logger : muter;