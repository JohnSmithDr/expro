'use strict';

const ExproContext = require('./expro-context');
const _await = require('./expro-await');
const exproJsonErrorMiddleware = require('./expro-json').exproJsonErrorMiddleware;

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
 */
Object.defineProperty(expro, 'Context', {
  get: function contextGetter() {
    return ExproContext;
  }
});

/**
 * Build expro await middleware.
 *
 * @example
 *
 *   expro.await(req => async(req));
 *
 * @param {function} handler - async handler
 * @returns {function}
 */
expro.await = (handler) => _await(handler, x => x);

module.exports = expro;