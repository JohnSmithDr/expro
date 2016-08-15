'use strict';

/**
 * Create middleware to write/overwrite status code.
 *
 * @example
 *
 *   expro(
 *     expro.await(req => async(req)),
 *     expro.status(201),
 *     expro.jsonResult()
 *   );
 *
 *   // overwrite status code to 201 before sending result
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