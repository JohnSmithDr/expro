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

  accepts(types) {
    let acc = this.headers['Accept'] || this.headers['accept'];
    if (typeof types === 'string') {
      return acc && acc.indexOf(types) >= 0 ? types : undefined;
    }
    else if (Array.isArray(types) && types.length) {
      for (let t of types) {
        let x = this.accepts(t);
        if (x) return x;
      }
    }
    return undefined;
  }

}

class MockResponse extends EventEmitter {

  constructor(opts) {
    super();
    opts = opts || {};
    this._status = null;
    this._headers = null;
    this._json = null;
    this._send = null;
    this.expro = opts.expro || {};
    this.req = opts.req;
  }

  header(field, value) {
    if (typeof field === 'string' && typeof value === 'string') {
      this._headers = Object.assign({}, this._headers || {}, { [field]: value });
    }
    if (typeof field === 'object' && value === undefined) {
      this._headers = Object.assign({}, this._headers || {}, field);
    }
  }

  status(value) {
    this._status = value;
    return this;
  }

  json(value) {
    this._json = value;
    this._send = value;
    this.end();
    return this;
  }

  send(obj) {
    this._send = obj;
    this.end();
  }

  format(formatter) {
    let type = this.req.accepts(['text', 'html', 'json', 'xml']);
    return type ? formatter[type]() : formatter['default']();
  }

  end() {
    this.emit('end');
  }

}

module.exports = { MockRequest, MockResponse };