'use strict';

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

module.exports = { MockResponse };