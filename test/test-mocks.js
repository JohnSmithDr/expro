'use strict';

function MockRequest(opts) {
  opts = opts || {};
  this.headers = opts.headers || {};
  this.params = opts.params || {};
  this.query = opts.query || {};
  this.body = opts.body || {};
}

function MockResponse() {
  this._status = null;
  this._json = null;
}

MockResponse.prototype = {
  status: function (value) {
    this._status = value;
    return this;
  },
  json: function (value) {
    this._json = value;
    return this;
  }
};

module.exports = { MockRequest, MockResponse };