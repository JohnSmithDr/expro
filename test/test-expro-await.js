'use strict';

const expect = require('chai').expect;

const await = require('../lib/expro-await');

const MockRequest = require('./test-mocks').MockRequest;
const MockResponse = require('./test-mocks').MockResponse;

describe('expro-await', function () {

  describe('.await()', function () {

    it('should be ok', function (done) {

      let req = new MockRequest({ body: { foo: 'bar' } });
      let res = new MockResponse();
      let mw = await(
        req => new Promise((resolve) => {
          setTimeout(() => resolve(req.body), 20);
        })
      );

      expect(mw).to.be.a('function');

      mw(req, res, () => {
        try {
          expect(res.expro.result).to.be.an('object');
          expect(res.expro.result).to.deep.equal({
            foo: 'bar'
          });
          done();
        }
        catch(err) {
          done(err);
        }
      });

    });

    it('should be ok with selector', function (done) {

      let req = new MockRequest({ body: { foo: 'bar' } });
      let res = new MockResponse();
      let mw = await(
        body => new Promise((resolve) => {
          setTimeout(() => resolve(body), 20);
        }),
        req => req.body
      );

      expect(mw).to.be.a('function');

      mw(req, res, () => {
        try {
          expect(res.expro.result).to.be.an('object');
          expect(res.expro.result).to.deep.equal({
            foo: 'bar'
          });
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
      let mw = await(
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