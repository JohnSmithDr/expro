'use strict';

const ExproContext = require('./expro-context');
const exproWith = require('./expro-with');
const exproAsync = require('./expro-async');
const exproAwait = require('./expro-await');
const exproSet = require('./expro-set');
const exproStatus = require('./expro-status');
const exproJsonResult = require('./expro-json-result');
const exproJsonError = require('./expro-json-error');

/**
 * Build express middleware with series of middleware.
 *
 * @example
 *
 *   let mw = expro(fn1, fn2, fn3, ...);
 *
 * @returns {function}
 */
function expro() {

  let fn = Array.prototype.slice.call(arguments);

  return function exproMiddleware(req, res, next) {

    let i = 0;

    let callback = (err) => {

      // get error
      if (err) return next(err);

      // no more handler to forward
      if (i >= fn.length) return next();

      try {
        return fn[i++](req, res, callback);
      }
      catch(err) {
        return next(err);
      }
    };

    callback();
  }

}

/**
 * expro.query
 * expro.body
 * expro.params
 */
['query', 'body', 'params'].forEach(ctx => {
  Object.defineProperty(expro, ctx, {
    get: function getter() {
      return ExproContext.in(ctx);
    }
  });
});

/**
 * expro.Context
 *
 * @returns {expro.Context}
 */
Object.defineProperty(expro, 'Context', {
  get: function contextGetter() {
    return ExproContext;
  }
});

/**
 * Create expro args selectors context.
 *
 * @example
 *
 *   expro.with('query', 'body');
 *   expro.with(x => x.query, x => x.body);
 *
 * @returns {ExproWithSelectors}
 */
expro.with = exproWith;

/**
 * Create expro await middleware.
 *
 * @example
 *
 *   expro.await(req => async(req));
 *
 * @param {function} handler - async handler
 * @returns {function}
 */
expro.await = exproAwait;

/**
 * Create promise for async process.
 *
 * @example
 *
 *   expro
 *     .async(done => fs.readFile('./config', done))
 *     .then(content => {
 *       // do with file content ...
 *     });
 *
 *   // to use the promise lib you like, such as bluebird
 *
 *   expro.async.use(require('bluebird'));
 *
 * @param {function} handler - async handler
 * @returns {Promise}
 */
expro.async = exproAsync;

/**
 * Create middleware to write/overwrite headers.
 *
 * @example
 *
 *   expro.set('Content-Type', 'text/plain');
 *
 * or:
 *
 *   expro.headers({
 *    'Content-Type': 'text/plain',
 *    'Content-Length': '123',
 *    'ETag': '12345'
 *  });
 *
 * @param field
 * @param [value]
 * @returns {function}
 */
expro.set = exproSet;

/**
 * Create middleware to write/overwrite status code.
 *
 * @example
 *
 *   expro(
 *     expro.await(req => async(req)),
 *     expro.status(201),
 *     expro.jsonResult()
 *   );
 *
 *   // overwrite status code to 201 before sending result
 *
 * @param {number} statusCode
 * @returns {function}
 */
expro.status = exproStatus;

/**
 * Create middleware to send json result.
 *
 * @example
 *
 *   let app = express();
 *
 *   app.get('/', (req, res, next) => {
 *     res.expro.result = { foo: 'bar' };
 *     next();
 *   });
 *
 *   app.use(expro.jsonResult());
 *
 *   // -> { code: 200, result: { foo: 'bar' } }
 *
 */
expro.jsonResult = exproJsonResult;

/**
 * Create middleware to send json error.
 *
 * @example
 *
 *   let app = express();
 *
 *   app.get('/', (req, res, next) => {
 *     next(Error('oops'));
 *   });
 *
 *   app.use(expro.jsonError());
 *
 *   // -> { code: 500, error: { message: 'oops' } }
 *
 */
expro.jsonError = exproJsonError;

module.exports = expro;