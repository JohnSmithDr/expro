'use strict';

/**
 * Middleware to add method to send json result.
 *
 * @example
 *
 *   let app = express();
 *   app.use(expro.json);
 *   app.get('/', (req, res) => {
 *     res.expro.jsonResult({ foo: 'bar' });
 *   });
 *
 *   // -> { code: 200, result: { foo: 'bar' } }
 *
 * @param req
 * @param res
 * @param next
 */
function exproJsonMiddleware(req, res, next) {

  res.expro = res.expro || {};

  res.expro.jsonResult = function exproJsonResult(result, statusCode) {
    let code = statusCode || 200;
    res.status(code).json({ code, result });
  };

  next();
}

/**
 * Middleware to add method to send json error.
 *
 * @example
 *
 *   let app = express();
 *   app.use(expro.jsonError);
 *   app.post('/', (req, res) => {
 *     res.expor.jsonError(Error('post method is not allowed'), 405);
 *   });
 *
 *   // -> { code: 405, error: 'post method is not allowed' }
 *
 * @param req
 * @param res
 * @param next
 */
function exproJsonErrorMiddleware(req, res, next) {

  res.expro = res.expro || {};

  res.expro.jsonError = function exproJsonErrorResult(err, statusCode) {
    let code = err.statusCode || err.status || statusCode || 500;
    let error = {
      code: err.errorCode || err.code,
      message: err.message
    };
    res.status(code).json({ code, error });
  };

  next();
}

module.exports = { exproJsonMiddleware, exproJsonErrorMiddleware };