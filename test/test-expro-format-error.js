'use strict';

const expect = require('chai').expect;

const expro = require('../lib');
const logger = require('./test-logger');

const MockRequest = require('./test-mocks').MockRequest;
const MockResponse = require('./test-mocks').MockResponse;

describe('expro.formatError()', function() {


  function testJson(err, expStatusCode, expErrorCode, expMessage) {

    return expro.async(done => {

      let req = new MockRequest({
        headers: {
          Accept: 'application/json'
        }
      });

      let res = new MockResponse({ req });

      res.on('end', () => {
        try {
          logger.debug('result:', res._send);
          expect(res._status).to.equal(expStatusCode);
          expect(res._send).to.deep.equal({
            code: expStatusCode,
            error: {
              code: expErrorCode,
              message: expMessage
            }
          });
          done();
        }
        catch(err) {
          done(err);
        }
      });

      expro.formatError()
      (err, req, res, (err) => {
        done(err);
      });

    });
  }

  function testText(err, expStatusCode, expErrorCode, expMessage) {

    return expro.async(done => {

      let req = new MockRequest({
        headers: {
          Accept: 'text/plain'
        }
      });

      let res = new MockResponse({ req });

      res.on('end', () => {
        try {
          logger.debug('text:', res._send);
          expect(res._status).to.equal(expStatusCode);
          expect(res._send).to.equal(
            `CODE=${expStatusCode} ERR_CODE=${expErrorCode || 'undefined'} ERR_MESSAGE=${expMessage || 'undefined'}`);
          done();
        }
        catch(err) {
          done(err);
        }
      });

      expro.formatError({
        text: (res, err) => {
          let code = err.statusCode || err.status || 500;
          let errCode = err.errorCode || err.code || 'undefined';
          let errMessage = err.message || 'undefined';
          res.status(code).send(`CODE=${code} ERR_CODE=${errCode} ERR_MESSAGE=${errMessage}`);
        }
      })
      (err, req, res, (err) => {
        done(err);
      });

    });
  }

  function testDefault(err) {

    return expro.async(done => {

      let req = new MockRequest();
      let res = new MockResponse({ req });

      res.on('end', () => {
        try {
          logger.debug('result:', res._send);
          expect(res._status).to.equal(406);
          expect(res._send).to.equal('Not Acceptable');
          done();
        }
        catch(err) {
          done(err);
        }
      });

      expro.formatError()
      (err, req, res, (err) => {
        done(err);
      });

    });
  }

  function test(err, expStatusCode, expErrorCode, expMessage) {

    let args = [ err, expStatusCode, expErrorCode, expMessage ];

    return testJson.apply(this, args)
      .then(() => testText.apply(this, args))
      .then(() => testDefault.apply(this, args));

  }

  it('should create a middleware', function () {
    let mw = expro.formatError();
    expect(mw).to.be.a('function');
    expect(mw.name).to.equal('exproFormatErrorMiddleware');
  });

  it('should send formatted error', function () {
    return test(Error('oops'), 500, undefined, 'oops');
  });

  it('should send formatted error with status', function () {
    let err = Error('oops');
    err.status = 400;
    return test(err, 400, undefined, 'oops');
  });

  it('should send formatted error with status code', function () {
    let err = Error('oops');
    err.statusCode = 400;
    err.status = 500;
    return test(err, 400, undefined, 'oops');
  });

  it('should send formatted error with code', function () {
    let err = Error('oops');
    err.status = 400;
    err.code = 'BAD_REQUEST';
    return test(err, 400, 'BAD_REQUEST', 'oops');
  });

  it('should send formatted error with error code', function () {
    let err = Error('oops');
    err.status = 403;
    err.code = 'BAD_REQUEST';
    err.errorCode = 'FORBIDDEN';
    return test(err, 403, 'FORBIDDEN', 'oops');
  });

});