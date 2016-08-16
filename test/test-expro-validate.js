'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

describe('expro.ctx.validate()', function () {

  it('should be ok', function (done) {

    let mw = expro.body.validate(body => {
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

describe('expro.ctx.prop().validate()', function () {

  it('should be ok', function (done) {

    let mw = expro.body.prop('foo').validate(foo => {
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

});