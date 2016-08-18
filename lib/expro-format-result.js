'use strict';

/**
 * Create middleware to send formatted result.
 *
 * @param {object} [formatter]
 * @return {function}
 */
function exproFormatResult(formatter) {

  formatter = formatter || {
      json: (res, code, result) => res.status(code).json({ result }),
      default: (res, code, result) => res.status(406).send('Not Acceptable')
    };

  return function exproFormatResultMiddleware(req, res, next) {

    if (res.hasOwnProperty('expro') && res.expro.hasOwnProperty('result')) {
      let result = res.expro && res.expro.result;
      let code = res.expro.statusCode || 200;
      return res.format({
        text: () => formatter.text(res, code, result),
        html: () => formatter.html(res, code, result),
        json: () => formatter.json(res, code, result),
        xml: () => formatter.xml(res, code, result),
        default: () => formatter.default(res, code, result)
      });
    }

    next();

  }

}

module.exports = exproFormatResult;