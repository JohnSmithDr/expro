'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockRequest = require('./test-mocks').MockRequest;

describe('expro.ctx.prop().convert()', function () {

  it('should be ok', function (done) {

    let req = new MockRequest({ body: { foo: 'bar' } });

    let mw = expro.body.prop('foo').convert(foo => foo.toUpperCase());

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      expect(req.body).to.deep.equal({ foo: 'BAR' });
      done();
    });

  });

});

describe('expro.ctx.prop().toInt()', function () {

  it('should be ok', function (done) {

    let req = new MockRequest({ query: { foo: '100' } });

    let mw = expro.query.prop('foo').toInt();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal(100);
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

  it('should be ok with default value', function (done) {

    let req = new MockRequest({ query: { foo: 'xxx' } });

    let mw = expro.query.prop('foo').toInt(10);

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal(10);
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

});

describe('expro.ctx.prop().toNumber()', function () {

  it('should be ok', function (done) {

    let req = new MockRequest({ query: { foo: '1.1' } });

    let mw = expro.query.prop('foo').toNumber();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal(1.1);
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

  it('should be ok with default value', function (done) {

    let req = new MockRequest({ query: { foo: '1.1' } });

    let mw = expro.query.prop('foo').toNumber();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal(1.1);
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

});