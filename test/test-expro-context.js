'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const ExproContext = require('../lib/expro-context');

describe('ExproContext', function () {

  describe('.of()', function () {

    it('should be ok', function () {
      let ctx = ExproContext.of('foo');
      expect(ctx._ctx).to.deep.equal('foo');
    });

  });

  describe('.in()', function () {

    it('should be ok', function () {
      let ctx = ExproContext.in('foo');
      expect(ctx._ctx).to.deep.equal({ in: 'foo' });
    });

  });

  describe('#prop()', function () {

    it('should be ok', function () {
      let ctx = ExproContext.in('foo').prop('bar');
      expect(ctx._ctx).to.deep.equal({ in: 'foo', prop: 'bar' });
    });

  });

});