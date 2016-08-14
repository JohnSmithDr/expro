'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockRequest = require('./test-mocks').MockRequest;
const MockResponse = require('./test-mocks').MockResponse;

describe('expro.await()', function () {

  it('should create a middleware', function () {
    let mw = expro.await(req => Promise.resolve('ok'));
    expect(mw).to.be.a('function');
  });

  it('should handle async process', function () {

    let req = new MockRequest({ body: { foo: 'bar' } });
    let res = new MockResponse();
    let mw = expro.await(
      req => new Promise((resolve) => {
        setTimeout(() => resolve(req.body), 20);
      })
    );

    mw(req, res, () => {
      try {
        expect(res.expro.result).to.be.an('object');
        expect(res.expro.result).to.deep.equal({ foo: 'bar' });
        done();
      }
      catch(err) {
        done(err);
      }
    });

  });

  it('should handle exception and pass to next', function (done) {

    let req = new MockRequest({ body: { foo: 'bar' } });
    let res = new MockResponse();
    let mw = expro.await(
      req => new Promise((resolve, reject) => {
        setTimeout(() => reject(Error('oops')), 20);
      })
    );

    mw(req, res, (e) => {
      try {
        expect(res.expro && res.expro.result).to.not.exist;
        expect(e).to.be.an('error');
        expect(e.message).to.equal('oops');
        done();
      }
      catch(err) {
        done(err);
      }
    });

  });

});