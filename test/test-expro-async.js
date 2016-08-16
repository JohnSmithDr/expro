'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

describe('expro.async', function () {

  it('should return promise', function () {

    expect(expro.async(done => done(0, 0))).to.be.instanceOf(Promise);

  });

  it('should resolve result and handle by then', function () {

    return expro
      .async(done => {
        setTimeout(() => done(0, 'ok'), 20);
      })
      .then(result => {
        expect(result).to.equal('ok');
      });

  });

  it('should reject error and handle by catch', function () {

    return expro
      .async(done => {
        setTimeout(() => done('oops'), 20);
      })
      .catch(err => {
        expect(err).to.equal('oops');
      });

  });

});