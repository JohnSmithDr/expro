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

  it('should be ok if prop is undefined', function (done) {

    let req = new MockRequest({ query: { foo: '100' } });

    let mw = expro.query.prop('bar').toInt();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal('100');
        expect(req.query).to.not.have.property('bar');
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

  it('should be ok if prop is not a numeric value', function (done) {

    let req = new MockRequest({ query: { foo: 'xxx' } });

    let mw = expro.query.prop('foo').toInt();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal(0);
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

  it('should be ok if prop is undefined', function (done) {

    let req = new MockRequest({ query: { foo: '100' } });

    let mw = expro.query.prop('bar').toNumber();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal('100');
        expect(req.query).to.not.have.property('bar');
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

  it('should be ok if prop is not a numeric value', function (done) {

    let req = new MockRequest({ query: { foo: 'xxx' } });

    let mw = expro.query.prop('foo').toNumber();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal(0);
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

describe('expro.ctx.prop().toBool()', function () {

  it('should be ok', function (done) {

    let cases = [
      ['true', true],
      ['True', true],
      ['TRUE', true],
      ['false', false],
      ['False', false],
      ['FALSE', false],
      ['yes', true],
      ['Yes', true],
      ['YES', true],
      ['no', false],
      ['No', false],
      ['NO', false],
      ['tru', false],
      ['fal', false],
      ['1', true],
      ['10', true],
      ['+1', true],
      ['-1', true],
      ['0', false],
      [1, true],
      [10, true],
      [+1, true],
      [-1, true],
      [0, false]
    ];

    let test = (i, value, expected, next) => {

      let req = new MockRequest({ query: { foo: value } });

      let mw = expro.query.prop('foo').toBool();

      expect(mw).to.be.a('function');

      mw(req, {}, () => {
        try {
          expect(req.query.foo).to.equal(expected);
          next(0, ++i);
        }
        catch(err) {
          console.error('# %s # value: %s, expected: %s', i, value, expected);
          next(err);
        }
      });

    };

    let next = (err, i) => {

      if (err) return done(err);
      if (i >= cases.length) return done();

      let d = cases[i];
      test(i, d[0], d[1], next);

    };

    next(0, 0);

  });

  it('should be ok if prop is undefined', function (done) {

    let req = new MockRequest({ query: { } });

    let mw = expro.query.prop('foo').toBool();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query).to.not.have.property('foo');
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

  it('should be ok if prop is not a boolean value', function (done) {

    let req = new MockRequest({ query: { foo: 'xxx' } });

    let mw = expro.query.prop('foo').toBool();

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal(false);
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

  it('should be ok with default value', function (done) {

    let req = new MockRequest({ query: { foo: 'xxx' } });

    let mw = expro.query.prop('foo').toBool(true);

    expect(mw).to.be.a('function');

    mw(req, {}, () => {
      try {
        expect(req.query.foo).to.equal(true);
        done();
      }
      catch(err) {
        done(err);
      }

    });

  });

});