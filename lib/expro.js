'use strict';

const ExproContext = require('./expro-context');
const exproWith = require('./expro-with');
const exproAsync = require('./expro-async');
const exproAwait = require('./expro-await');
const exproHeader = require('./expro-header');
const exproStatus = require('./expro-status');
const exproMapResult = require('./expro-map-result');
const exproWrap = require('./expro-wrap');
const exproFormatResult = require('./expro-format-result');
const exproFormatError = require('./expro-format-error');

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
 * Create middleware to write/overwrite response headers.
 *
 * @example
 *
 *   expro.header('Content-Type', 'text/plain');
 *
 * or:
 *
 *   expro.header({
 *    'Content-Type': 'text/plain',
 *    'Content-Length': '123',
 *    'ETag': '12345'
 *  });
 *
 * @param field
 * @param [value]
 * @returns {function}
 */
expro.header = exproHeader;

/**
 * Create middleware to write/overwrite response status code.
 *
 * @example
 *
 *   expro(
 *     expro.await(req => async(req)),
 *     expro.status(201),
 *     expro.formatResult()
 *   );
 *
 *   // overwrite status code to 201 before sending result
 *
 * @param {number} statusCode
 * @returns {function}
 */
expro.status = exproStatus;

/**
 * Create middleware to map result.
 *
 * @example
 *
 *   expro(
 *     expro.await(req => Promise.resolve({ foo: 'bar' })),
 *     expro.mapResult(r => {
 *       return { data: r };
 *     }),
 *     expro.formatResult()
 *   );
 *
 *   // -> { result: { data: { foo: 'bar' } } }
 *
 * @param {function}
 * @returns {function}
 */
expro.mapResult = exproMapResult;

/**
 * Create middleware to wrap result in given key.
 *
 *   expro(
 *     expro.await(req => Promise.resolve({ foo: 'bar' })),
 *     expro.wrap('data'),
 *     expro.formatResult()
 *   );
 *
 *   // -> { result: { data: { foo: 'bar' } } }
 *
 * @param {string} key
 * @return {function}
 */
expro.wrap = exproWrap;

/**
 * Create middleware to send formatted result.
 *
 * @example
 *
 *   expro(
 *     expro.await(req => Promise.resolve({ foo: 'bar' })),
 *     expro.formatResult()
 *   );
 *
 *   // -> { result: { foo: 'bar' } }
 *
 * @param {object} [formatter]
 * @return {function}
 */
expro.formatResult = exproFormatResult;

/**
 * Create middleware to send formatted error result.
 *
 * @example
 *
 *   expro(
 *     expro.await(req => Promise.reject(Error('oops'))),
 *     expro.formatError()
 *   );
 *
 *   // -> { error: { message: 'oops' } }
 *
 * @param {object} [formatter]
 * @return {function}
 */
expro.formatError = exproFormatError;

module.exports = expro;