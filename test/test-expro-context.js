'use strict';

const expect = require('chai').expect;

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

  describe('#convert()', function () {

    it('should be ok', function (done) {

      let req = { body: { foo: '100' } };
      let mw = ExproContext.in('body').prop('foo').convert(foo => parseInt(foo));

      expect(mw).to.be.a('function');

      mw(req, {}, () => {
        expect(req).to.deep.equal({
          body: { foo: 100 }
        });
        done();
      });

    });

  });

  describe('#require()', function () {

    it('should be ok', function () {
      let ctx = ExproContext.in('body').prop('foo').require();
      expect(ctx._ctx).to.deep.equal({
        prop: 'foo',
        in: 'body',
        validation: {
          require: true,
          messages: {
            require: undefined
          }
        }
      });
    });

    it('should be ok with message', function () {
      let ctx = ExproContext.in('body').prop('foo').require('foo is required');
      expect(ctx._ctx).to.deep.equal({
        prop: 'foo',
        in: 'body',
        validation: {
          require: true,
          messages: {
            require: 'foo is required'
          }
        }
      });
    });

  });

  describe('#notNull()', function () {

    it('should be ok', function () {
      let ctx = ExproContext.in('body').prop('foo').notNull();
      expect(ctx._ctx).to.deep.equal({
        prop: 'foo',
        in: 'body',
        validation: {
          notNull: true,
          messages: {
            notNull: undefined
          }
        }
      });
    });

    it('should be ok with message', function () {
      let ctx = ExproContext.in('body').prop('foo').notNull('foo should not be null');
      expect(ctx._ctx).to.deep.equal({
        prop: 'foo',
        in: 'body',
        validation: {
          notNull: true,
          messages: {
            notNull: 'foo should not be null'
          }
        }
      });
    });

  });

  describe('#notEmpty()', function () {

    it('should be ok', function () {
      let ctx = ExproContext.in('body').prop('foo').notEmpty();
      expect(ctx._ctx).to.deep.equal({
        prop: 'foo',
        in: 'body',
        validation: {
          notEmpty: true,
          messages: { notEmpty: undefined }
        }
      });
    });

    it('should be ok with message', function () {
      let ctx = ExproContext.in('body').prop('foo').notEmpty('foo should not be empty string');
      expect(ctx._ctx).to.deep.equal({
        prop: 'foo',
        in: 'body',
        validation: {
          notEmpty: true,
          messages: { notEmpty: 'foo should not be empty string' }
        }
      });
    });

  });

});