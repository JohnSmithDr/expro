'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockResponse = require('./test-mocks').MockResponse;

describe('expro.set()', function () {

  it('should create a middleware', function () {

    expect(expro.set({})).to.be.a('function');

  });

  it('should override response headers', function (done) {

    expro(
      expro.set('Content-Type', 'application/json'),
      expro.set({
        'X-CUSTOM-FOO': 'FOO',
        'X-CUSTOM-BAR': 'BAR'
      }),
      (req, res, next) => {
        try {
          console.log('headers:', res._headers);
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