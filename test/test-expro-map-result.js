'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const logger = require('./test-logger');
const MockRequest = require('./test-mocks').MockRequest;
const MockResponse = require('./test-mocks').MockResponse;

describe('expro.mapResult()', function () {

  it('should create a middleware', function () {

    let mw = expro.mapResult(x => x);
    expect(mw).to.be.a('function');
    expect(mw.name).to.equal('exproMapResultMiddleware');

  });

  it('should override status code', function (done) {

    expro(
      (req, res, next) => {
        res.expro.result = { foo: 'foo', bar: 'bar' };
        next();
      },
      expro.mapResult(x => {
        logger.debug('x:', x);
        return Object
          .keys(x)
          .reduce((y, key) => {
            y[key] = y[key].toUpperCase();
            return y;
          }, x);
      }),
      (req, res, next) => {
        try {
          logger.debug('result:', res.expro.result);
          expect(res.expro.result).to.deep.equal({
            foo: 'FOO',
            bar: 'BAR'
          });
          next();
        }
        catch(err) {
          next(err);
        }
      }
    )(new MockRequest(), new MockResponse(), (err) => {
      done(err);
    })

  });

});