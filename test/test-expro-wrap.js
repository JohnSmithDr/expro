'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const logger = require('./test-logger');
const MockRequest = require('./test-mocks').MockRequest;
const MockResponse = require('./test-mocks').MockResponse;

describe('expro.wrap()', function () {

  it('should create a middleware', function () {

    let mw = expro.wrap('data');
    expect(mw).to.be.a('function');
    expect(mw.name).to.equal('exproWrapResultMiddleware');

  });

  it('should be ok', function (done) {

    expro(
      (req, res, next) => {
        res.expro.result = { foo: 'foo', bar: 'bar' };
        next();
      },
      expro.wrap('data'),
      (req, res, next) => {
        try {
          logger.debug('result:', res.expro.result);
          expect(res.expro.result).to.deep.equal({
            data: {
              foo: 'foo',
              bar: 'bar'
            }
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