'use strict';

/**
 * Create middleware to write/overwrite response headers.
 * 
 * @param field
 * @param [value]
 * @returns {function}
 */
function exproHeader(field, value) {
  return function exproHeadersOverrideMiddleware(req, res, next) {
    res.header(field, value);
    next();
  }
}

module.exports = exproHeader;