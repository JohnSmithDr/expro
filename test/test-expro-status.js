'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockResponse = require('./test-mocks').MockResponse;

describe('expro.status()', function () {

  it('should create a middleware', function () {

    let mw = expro.status(200);
    expect(mw).to.be.a('function');
    expect(mw.name).to.equal('exproStatusCodeOverrideMiddleware');

  });

  it('should override status code', function (done) {

    expro(
      (req, res, next) => {
        res.status(200);
        next();
      },
      expro.status(201),
      (req, res, next) => {
        try {
          expect(res._status).to.equal(201);
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