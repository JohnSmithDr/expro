'use strict';

/**
 * Create middleware to write/overwrite response status code.
 *
 * @param {number} statusCode
 * @returns {function}
 */
function exproStatus(statusCode) {
  return function exproStatusCodeOverrideMiddleware(req, res, next) {
    res.status(statusCode);
    next();
  }
}

module.exports = exproStatus;