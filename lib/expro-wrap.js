'use strict';

/**
 * Create middleware to wrap result in given key.
 *
 * @param {string} key
 * @return {function}
 */
function exproWrap(key) {
  return function exproWrapResultMiddleware(req, res, next) {
    if (res.hasOwnProperty('expro') && res.expro.hasOwnProperty('result')) {
      let result = res.expro && res.expro.result;
      res.expro.result = { [key]: result };
    }
    next();
  }
}

module.exports = exproWrap;