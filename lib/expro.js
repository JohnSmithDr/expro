'use strict';

const ExproContext = require('./expro-context');

/**
 * Build express middleware with series of middleware.
 *
 * @example
 *
 * let mw = expro(fn1, fn2, fn3, ...);
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

expro.key = ExproContext.key;

module.exports = expro;