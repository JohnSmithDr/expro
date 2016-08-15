'use strict';

const expect = require('chai').expect;

const expro = require('../lib');
const ExproContext = require('../lib/expro-context');

const MockRequest = require('./test-mocks').MockRequest;

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

  describe('#validate()', function () {

    it('should be ok with value validation', function (done) {

      let mw = ExproContext.in('body').prop('foo').validate(foo => {
        if (foo !== 'foo') throw Error('expect foo to be "foo"');
      });

      expect(mw).to.be.a('function');

      mw({ body: { foo: 'foo' } }, {}, (err) => {
        expect(err).to.not.exist;

        mw({ body: { foo: 'bar' } }, {}, (err) => {
          expect(err).to.exist;
          expect(err.message).to.match(/expect foo to be "foo"/);
          done();
        });

      });

    });

    it('should be ok with context validation', function (done) {

      let mw = ExproContext.in('body').validate(body => {
        if (body.foo !== 'foo') throw Error('expect body.foo to be "foo"');
      });

      expect(mw).to.be.a('function');

      mw({ body: { foo: 'foo' } }, {}, (err) => {
        expect(err).to.not.exist;

        mw({ body: { foo: 'bar' } }, {}, (err) => {
          expect(err).to.exist;
          expect(err.message).to.match(/expect body.foo to be "foo"/);
          done();
        });

      });

    });

  });

  

});