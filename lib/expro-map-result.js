'use strict';

/**
 * Create middleware to map result.
 *
 * @param {function} mapper
 * @return {function}
 */
function exproMapResult(mapper) {
  return function exproMapResultMiddleware(req, res, next) {
    if (res.hasOwnProperty('expro') && res.expro.hasOwnProperty('result')) {
      let result = res.expro && res.expro.result;
      res.expro.result = mapper(result);
    }
    next();
  }
}

module.exports = exproMapResult;