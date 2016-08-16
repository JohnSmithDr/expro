'use strict';

/**
 * Create middleware to write/overwrite response headers.
 * 
 * @param field
 * @param [value]
 * @returns {function}
 */
function exproSet(field, value) {
  return function exproHeadersOverrideMiddleware(req, res, next) {
    res.set(field, value);
    next();
  }
}

module.exports = exproSet;