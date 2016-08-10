'use strict';

const expect = require('chai').expect;

const ExproContext = require('../lib/expro-context');

describe('ExproContext', function () {

  describe('#key', function () {

    it('should be ok', function () {
      let ctx = ExproContext.key('foo');
      expect(ctx._ctx).to.deep.equal({ key: 'foo' });
    });

  });

  describe('#inQuery', function () {

    it('should be ok', function () {
      let ctx = ExproContext.key('foo').inQuery();
      expect(ctx._ctx).to.deep.equal({ key: 'foo', in: 'query' });
    });

  });

  describe('#inBody', function () {

    it('should be ok', function () {
      let ctx = ExproContext.key('foo').inBody();
      expect(ctx._ctx).to.deep.equal({ key: 'foo', in: 'body' });
    });

  });

  describe('#inParams', function () {

    it('should be ok', function () {
      let ctx = ExproContext.key('foo').inParams();
      expect(ctx._ctx).to.deep.equal({ key: 'foo', in: 'params' });
    });

  });

  describe('#require', function () {

    it('should be ok', function () {
      let ctx = ExproContext.key('foo').require();
      expect(ctx._ctx).to.deep.equal({
        key: 'foo',
        validators: { require: true },
        messages: { require: undefined }
      });
    });

    it('should be ok with message', function () {
      let ctx = ExproContext.key('foo').require('foo is required');
      expect(ctx._ctx).to.deep.equal({
        key: 'foo',
        validators: { require: true },
        messages: { require: 'foo is required' }
      });
    });

  });

  describe('#notNull', function () {

    it('should be ok', function () {
      let ctx = ExproContext.key('foo').notNull();
      expect(ctx._ctx).to.deep.equal({
        key: 'foo',
        validators: { notNull: true },
        messages: { notNull: undefined }
      });
    });

    it('should be ok with message', function () {
      let ctx = ExproContext.key('foo').notNull('foo should not be null');
      expect(ctx._ctx).to.deep.equal({
        key: 'foo',
        validators: { notNull: true },
        messages: { notNull: 'foo should not be null' }
      });
    });

  });

  describe('#notEmpty', function () {

    it('should be ok', function () {
      let ctx = ExproContext.key('foo').notEmpty();
      expect(ctx._ctx).to.deep.equal({
        key: 'foo',
        validators: { notEmpty: true },
        messages: { notEmpty: undefined }
      });
    });

    it('should be ok with message', function () {
      let ctx = ExproContext.key('foo').notEmpty('foo should not be empty string');
      expect(ctx._ctx).to.deep.equal({
        key: 'foo',
        validators: { notEmpty: true },
        messages: { notEmpty: 'foo should not be empty string' }
      });
    });

  });


});