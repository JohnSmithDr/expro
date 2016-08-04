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