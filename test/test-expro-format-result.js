'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockRequest = require('./test-mocks').MockRequest;
const MockResponse = require('./test-mocks').MockResponse;

describe('expro.formatResult()', function () {

  it('should create a middleware', function () {
    let mw = expro.formatResult();
    expect(mw).to.be.a('function');
    expect(mw.name).to.equal('exproFormatResultMiddleware');
  });

  it('should send result as json', function (done) {

    let req = new MockRequest({
      headers: {
        Accept: 'application/json'
      }
    });

    let res = new MockResponse({
      req: req,
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

    expro.formatResult()(req, res, () => {
      done(Error('should not go here'));
    });
  });

  it('should send result with status code', function (done) {

    let req = new MockRequest({
      headers: {
        Accept: 'application/json'
      }
    });

    let res = new MockResponse({
      req: req,
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

    expro.formatResult()(null, res, () => {
      done(Error('should not go here'));
    });
  });

  it('should send result as text', function (done) {

    let req = new MockRequest({
      headers: {
        Accept: 'text/plain'
      }
    });

    let res = new MockResponse({
      req: req,
      expro: {
        statusCode: 201,
        result: 'created'
      }
    });

    res.on('end', () => {
      try {
        expect(res._status).to.equal(201);
        expect(res._send).to.deep.equal('created');
        done();
      }
      catch(err) {
        done(err);
      }
    });

    expro.formatResult({
      text: (res, code, result) => {
        res.status(code).send(result.toString());
      }
    })
    (null, res, () => {
      done(Error('should not go here'));
    });
  });

});