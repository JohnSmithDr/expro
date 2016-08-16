'use strict';

/**
 * Create middleware to write/overwrite headers.
 *
 * @example
 *
 *   expro.set('Content-Type', 'text/plain');
 *
 * or:
 * 
 *   expro.set({
 *    'Content-Type': 'text/plain',
 *    'Content-Length': '123',
 *    'ETag': '12345'
 *  });
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