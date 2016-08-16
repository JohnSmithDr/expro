'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

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

describe('expro.ctx.prop()', function () {

  it('should be ok', function () {
    let ctx = expro.query.prop('foo');
    expect(ctx).to.be.instanceOf(expro.Context);
    expect(ctx._ctx).to.deep.equal({ in: 'query', prop: 'foo' });
  });

});

