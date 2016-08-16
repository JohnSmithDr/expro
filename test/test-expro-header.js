'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockResponse = require('./test-mocks').MockResponse;

describe('expro.header()', function () {

  it('should create a middleware', function () {

    expect(expro.header({})).to.be.a('function');

  });

  it('should override response headers', function (done) {

    expro(
      expro.header('Content-Type', 'application/json'),
      expro.header({
        'X-CUSTOM-FOO': 'FOO',
        'X-CUSTOM-BAR': 'BAR'
      }),
      (req, res, next) => {
        try {
          expect(res._headers).to.deep.equal({
            'Content-Type': 'application/json',
            'X-CUSTOM-FOO': 'FOO',
            'X-CUSTOM-BAR': 'BAR'
          });
          next();
        }
        catch(err) {
          next(err);
        }
      }
    )(null, new MockResponse(), (err) => {
      done(err);
    })

  });

});