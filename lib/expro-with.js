'use strict';

const _nullSelector = () => null;

const _pathSelector = (path) => (x) => {

};

const _resolveSelectors = (arr) => {
  return arr.map(s => {
    if (typeof s === 'function') return s;
    if (typeof s === 'string') return _pathSelector(s);
    return _nullSelector;
  });
};

/**
 * Create await middleware with args selectors for async process.
 *
 * @example
 *
 *   expro
 *     .with(_ => _.body)
 *     .await(body => {
 *       return new Promise((resolve, reject) => {
 *         setTimeout(() => resolve('ok'), 500);
 *       });
 *     });
 *
 * @param {function} handler - async handler
 * @returns {function}
 */
function await(handler) {

  let ctx = this;

  return function exproAwaitWithMiddleware(req, res, next) {

    let args = ctx._selectors.map(s => s(req));
    try {
      handler.apply(ctx, args)
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

function ExproWithContext(selectors) {

  if (!(Array.isArray(selectors) && selectors.length)) {
    throw Error('argument: selectors must be an array');
  }

  this._selectors = selectors;

}

ExproWithContext.prototype = { await };

/**
 * Return expro with context.
 *
 * @returns {ExproWithContext}
 */
function exproWith() {
  let arr = Array.prototype.slice.call(arguments);
  return new ExproWithContext(_resolveSelectors(arr));
}

module.exports = exproWith;