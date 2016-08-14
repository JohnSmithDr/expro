'use strict';

/**
 * Await middleware for async process.
 *
 * @example
 *
 *   let mw = expro.await(req => {
 *     return new Promise((resolve, reject) => {
 *       setTimeout(() => resolve('ok'), 500);
 *     });
 *   });
 *
 * @param {function} handler - async handler
 * @param {function} [selector] - context selector
 * @returns {function}
 */
function await(handler, selector) {

  return function exproAwaitMiddleware(req, res, next) {

    let ctxSelector = typeof selector === 'function' ? selector : (x) => x;

    try {
      handler(ctxSelector(req))
        .then(result => {
          res.expro = res.expro || {};
          res.expro.result = result;
          next();
        })
        .catch(err => {
          next(err);
        });
    }
    catch(err) {
      next(err);
    }

  }
}

module.exports = await;