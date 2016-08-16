'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockRequest = require('./test-mocks').MockRequest;
const MockResponse = require('./test-mocks').MockResponse;

describe('expro.with()', function () {

  it('should be return the with selector context', function () {

    let mock = {
      query: { foo: 'bar' },
      body: { foo: 'bar' }
    };

    let ctx = expro.with(x => x.query, x => x.body);

    expect(ctx._selectors).to.be.an('array').and.have.length(2);

    ctx._selectors.forEach(s => {
      expect(s).to.be.a('function');
      expect(s(mock)).to.deep.equal({ foo: 'bar' });
    });

  });

  it('should throw error for empty selectors', function () {
    
    expect(() => expro.with()).to.throw(/selectors must be an array/);

  });

});

describe('expro.with().await()', function () {

  it('should be ok', function (done) {

    let req = new MockRequest({
      params: { id: 10000 },
      body: {
        data: { foo: 'foo', bar: 'bar' }
      }
    });

    let res = new MockResponse();

    expro(
      expro
        .with(x => x.params.id, x => x.body.data)
        .await((id, data) => {
          return expro.async(done => {
            setTimeout(() => done(0, { id, data }), 20);
          });
        })
    )(req, res, (err) => {

      if (err) return done(err);

      try {
        expect(res.expro.result).to.deep.equal({
          id: 10000,
          data: { foo: 'foo', bar: 'bar' }
        });
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

  it('should be ok with path selectors', function (done) {

    let req = new MockRequest({
      params: { id: 10000 },
      body: {
        data: { foo: 'foo', bar: 'bar' }
      }
    });

    let res = new MockResponse();

    expro(
      expro
        .with('params.id', 'body.data')
        .await((id, data) => {
          return expro.async(done => {
            setTimeout(() => done(0, { id, data }), 20);
          });
        })
    )(req, res, (err) => {

      if (err) return done(err);

      try {
        expect(res.expro.result).to.deep.equal({
          id: 10000,
          data: { foo: 'foo', bar: 'bar' }
        });
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

});