'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockResponse = require('./test-mocks').MockResponse;

describe('expro.jsonResult()', function () {

  it('should create a middleware', function () {
    expect(expro.jsonResult()).to.be.a('function');
  });

  it('should send result as json', function (done) {

    let res = new MockResponse({
      expro: {
        result: { foo: 'bar' }
      }
    });

    res.on('end', () => {
      try {
        expect(res._status).to.equal(200);
        expect(res._json).to.deep.equal({
          code: 200,
          result: { foo: 'bar' }
        });
        done();
      }
      catch(err) {
        done(err);
      }
    });

    expro.jsonResult()(null, res, () => {
      done(Error('should not go here'));
    });
  });

  it('should send result with status code', function (done) {

    let res = new MockResponse({
      expro: {
        statusCode: 201,
        result: 'created'
      }
    });

    res.on('end', () => {
      try {
        expect(res._status).to.equal(201);
        expect(res._json).to.deep.equal({
          code: 201,
          result: 'created'
        });
        done();
      }
      catch(err) {
        done(err);
      }
    });

    expro.jsonResult()(null, res, () => {
      done(Error('should not go here'));
    });
  });

});

describe('expro.jsonError()', function() {

  function test(err, expStatusCode, expErrorCode, expMessage, done) {

    let res = new MockResponse();

    res.on('end', () => {
      try {
        expect(res._status).to.equal(expStatusCode);
        expect(res._json).to.deep.equal({
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

    expro.jsonError()(err, null, res, () => {
      done(Error('should not go here'));
    });
  }

  it('should create a middleware', function () {
    expect(expro.jsonError()).to.be.a('function');
  });

  it('should send error as json', function (done) {
    test(Error('oops'), 500, undefined, 'oops', done);
  });

  it('should send error with status', function (done) {
    let err = Error('oops');
    err.status = 400;
    test(err, 400, undefined, 'oops', done);
  });

  it('should send error with status code', function (done) {
    let err = Error('oops');
    err.statusCode = 400;
    err.status = 500;
    test(err, 400, undefined, 'oops', done);
  });

  it('should send error with code', function (done) {
    let err = Error('oops');
    err.status = 400;
    err.code = 'BAD_REQUEST';
    test(err, 400, 'BAD_REQUEST', 'oops', done);
  });

  it('should send error with error code', function (done) {
    let err = Error('oops');
    err.status = 403;
    err.code = 'BAD_REQUEST';
    err.errorCode = 'FORBIDDEN';
    test(err, 403, 'FORBIDDEN', 'oops', done);
  });

});