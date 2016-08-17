'use strict';

/**
 * Create middleware to send formatted error result.
 *
 * @param {object} [formatter]
 * @return {function}
 */
function exproFormatError(formatter) {

  formatter = formatter || {
      json: (res, err) => {
        let code = err.statusCode || err.status || 500;
        let error = {
          code: err.errorCode || err.code,
          message: err.message
        };
        res.status(code).json({ code, error });
      },
      default: (res, err) => res.status(406).send('Not Acceptable')
    };

  return function exproFormatErrorMiddleware(err, req, res, next) {
    return res.format({
      text: () => formatter.text(res, err),
      html: () => formatter.html(res, err),
      json: () => formatter.json(res, err),
      xml: () => formatter.xml(res, err),
      default: () => formatter.default(res, err)
    });
  }

}

module.exports = exproFormatError;