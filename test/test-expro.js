'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockRequest = require('./test-mocks').MockRequest;
const MockResponse = require('./test-mocks').MockResponse;

describe('expro', function () {

  describe('expro', function () {

    it('should return a function as middleware', function (done) {

      let r = [];

      let fn = expro(
        (req, res, next) => {
          r.push('foo');
          return next();
        },
        (req, res, next) => {
          r.push('bar');
          return next();
        }
      );

      fn('req', 'res', () => {
        expect(r).to.deep.equal(['foo', 'bar']);
        done();
      });

    });

  });
  
  describe('expro.query', function () {

    it('should return a query context', function () {
      let ctx = expro.query;
      expect(ctx).to.be.instanceOf(expro.Context);
      expect(ctx._ctx).to.deep.equal({ in: 'query' });
    });

  });

  describe('expro.body', function () {

    it('should return a body context', function () {
      let ctx = expro.body;
      expect(ctx).to.be.instanceOf(expro.Context);
      expect(ctx._ctx).to.deep.equal({ in: 'body' });
    });

  });

  describe('expro.params', function () {

    it('should return a params context', function () {
      let ctx = expro.params;
      expect(ctx).to.be.instanceOf(expro.Context);
      expect(ctx._ctx).to.deep.equal({ in: 'params' });
    });

  });

  describe('expro.await()', function () {

    it('should be ok', function (done) {

      let req = new MockRequest({ body: { foo: 'bar' } });
      let res = new MockResponse();
      let mw = expro.await(
        req => new Promise((resolve) => {
          setTimeout(() => resolve(req.body), 20);
        })
      );

      expect(mw).to.be.a('function');

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

      expect(mw).to.be.a('function');

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

});