'use strict';

/**
 * Create middleware to send json error.
 *
 * @example
 *
 *   let app = express();
 *
 *   app.get('/', (req, res, next) => {
 *     next(Error('oops'));
 *   });
 *
 *   app.use(expro.jsonError());
 *
 *   // -> { code: 500, error: { message: 'oops' } }
 *
 */
function exproJsonError() {

  return function exproJsonErrorMiddleware(err, req, res, next) {

    let code = err.statusCode || err.status || 500;
    let error = {
      code: err.errorCode || err.code,
      message: err.message
    };
    res.status(code).json({ code, error });
  }

}

module.exports = exproJsonError;