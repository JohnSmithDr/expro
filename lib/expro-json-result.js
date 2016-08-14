'use strict';

/**
 * Create middleware to send json result.
 *
 * @example
 *
 *   let app = express();
 *
 *   app.get('/', (req, res, next) => {
 *     res.expro.result = { foo: 'bar' };
 *     next();
 *   });
 *
 *   app.use(expro.jsonResult());
 *
 *   // -> { code: 200, result: { foo: 'bar' } }
 *
 */
function exproJsonResult() {

  return function exproJsonMiddleware(req, res, next) {

    if (res.hasOwnProperty('expro') && res.expro.hasOwnProperty('result')) {
      let result = res.expro && res.expro.result;
      let code = res.expro.statusCode || 200;
      res.status(code).json({ code, result });
      return;
    }

    next();
  }
}

module.exports = exproJsonResult;