'use strict';

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

  return function expressMiddleware(req, res, next) {

    let i = 0;

    let callback = function callback(err) {
      if (err) {
        callback = undefined;
        return next(err);
      }
      if (i >= fn.length) {
        callback = undefined;
        return next();
      }
      try {
        return fn[i++](req, res, callback);
      }
      catch(err) {
        callback = undefined;
        return next(err);
      }
    };

    fn[i++](req, res, callback);
  }

}

module.exports = expro;