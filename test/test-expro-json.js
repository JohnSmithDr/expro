'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

const MockResponse = require('./test-mocks').MockResponse;

// describe('expro-json', function () {
//
//   describe('.exproJsonErrorMiddleware', function () {
//
//     function test(args, expectedStatus, expectedJson, done) {
//
//       let res = new MockResponse();
//
//       exproJsonErrorMiddleware(null, res, () => {
//         try {
//           expect(res.expro.jsonError).to.be.a('function');
//           res.expro.jsonError.apply(this, args);
//           expect(res._status).to.equal(expectedStatus);
//           expect(res._json).to.deep.equal(expectedJson);
//           done();
//         }
//         catch(err) {
//           done(err);
//         }
//       });
//     }
//
//     it('should be ok', function (done) {
//       test([ Error('oops') ], 500, {
//         code: 500,
//         error: { code: undefined, message: 'oops' }
//       }, done);
//     });
//
//     it('should be ok with args statusCode', function (done) {
//       test([ Error('oops'), 400 ], 400, {
//         code: 400,
//         error: { code: undefined, message: 'oops' }
//       }, done);
//     });
//
//     it('should be ok with error.statusCode', function (done) {
//       let err = Object.assign(Error('oops'), { statusCode: 400 });
//       test([ err, 200 ], 400, {
//         code: 400,
//         error: { code: undefined, message: 'oops' }
//       }, done);
//     });
//
//     it('should be ok with error.status', function (done) {
//       let err = Object.assign(Error('oops'), { status: 400 });
//       test([ err, 200 ], 400, {
//         code: 400,
//         error: { code: undefined, message: 'oops' }
//       }, done);
//     });
//
//     it('should be ok with error.errorCode', function (done) {
//       let err = Object.assign(Error('oops'), { errorCode: 'BAD_REQUEST' });
//       test([ err, 400 ], 400, {
//         code: 400,
//         error: { code: 'BAD_REQUEST', message: 'oops' }
//       }, done);
//     });
//
//     it('should be ok with error.code', function (done) {
//       let err = Object.assign(Error('oops'), { code: 'BAD_REQUEST' });
//       test([ err, 400 ], 400, {
//         code: 400,
//         error: { code: 'BAD_REQUEST', message: 'oops' }
//       }, done);
//     });
//
//   });
//
// });

describe('expro.jsonResult()', function () {

  it('should create a middleware', function () {
    expect(expro.jsonResult()).to.be.a('function');
  });

  it('should send result as json', function (done) {

    let res = new MockResponse({
      expro: {
        result: { foo: 'bar' }
      }
    });

    res.on('end', () => {
      try {
        expect(res._status).to.equal(200);
        expect(res._json).to.deep.equal({
          code: 200,
          result: { foo: 'bar' }
        });
        done();
      }
      catch(err) {
        done(err);
      }
    });

    expro.jsonResult()(null, res, () => {
      done(Error('should not go here'));
    });
  });

  it('should send result with status code', function (done) {

    let res = new MockResponse({
      expro: {
        statusCode: 201,
        result: 'created'
      }
    });

    res.on('end', () => {
      try {
        expect(res._status).to.equal(201);
        expect(res._json).to.deep.equal({
          code: 201,
          result: 'created'
        });
        done();
      }
      catch(err) {
        done(err);
      }
    });

    expro.jsonResult()(null, res, () => {
      done(Error('should not go here'));
    });
  });

});