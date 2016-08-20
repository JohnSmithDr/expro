'use strict';

const expect = require('chai').expect;

const expro = require('../lib');
const logger = require('./test-logger');

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
        logger.debug('result:', res._send);
        expect(res._send).to.deep.equal({
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
        result: 'created'
      }
    });

    res.on('end', () => {
      try {
        logger.debug('result:', res._send);
        expect(res._send).to.deep.equal({
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
        result: 'created'
      }
    });

    res.on('end', () => {
      try {
        logger.debug('result:', res._send);
        expect(res._send).to.deep.equal('created');
        done();
      }
      catch(err) {
        done(err);
      }
    });

    expro.formatResult({
      text: (res, result) => {
        res.send(result.toString());
      }
    })
    (req, res, () => {
      done(Error('should not go here'));
    });
  });

  it('should send 406 for not acceptable', function (done) {

    let req = new MockRequest();
    let res = new MockResponse({
      req: req,
      expro: {
        result: "You can't see me"
      }
    });

    res.on('end', () => {
      try {
        logger.debug('result:', res._send);
        expect(res._status).to.equal(406);
        expect(res._send).to.deep.equal('Not Acceptable');
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

});