'use strict';

const EventEmitter = require('events');

class MockRequest {

  constructor(opts) {
    opts = opts || {};
    this.headers = opts.headers || {};
    this.params = opts.params || {};
    this.query = opts.query || {};
    this.body = opts.body || {};
  }

}

class MockResponse extends EventEmitter {

  constructor(opts) {
    super();
    opts = opts || {};
    this._status = null;
    this._json = null;
    this.expro = opts.expro;
  }

  status(value) {
    this._status = value;
    return this;
  }

  json(value) {
    this._json = value;
    this.end();
    return this;
  }

  end() {
    this.emit('end');
  }

}

module.exports = { MockRequest, MockResponse };