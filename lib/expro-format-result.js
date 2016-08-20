'use strict';

function ResultFormatter(formatter) {
  this._formatter = formatter;
}

ResultFormatter.prototype = {
  format: function (type, res, code, result) {
    let fn = (typeof this._formatter[type] === 'function')
      ? this._formatter[type]
      : this._formatter['default'];
    if (typeof fn !== 'function') throw Error('No available formatter');
    fn(res, code, result);
  }
};

/**
 * Create middleware to send formatted result.
 *
 * @param {object} [formatter]
 * @return {function}
 */
function exproFormatResult(formatter) {

  let resFormatter = new ResultFormatter(formatter || {
      json: (res, code, result) => res.status(code).json({ result }),
      default: (res, code, result) => res.status(406).send('Not Acceptable')
    });

  return function exproFormatResultMiddleware(req, res, next) {

    if (res.hasOwnProperty('expro') && res.expro.hasOwnProperty('result')) {
      let result = res.expro && res.expro.result;
      let code = res.expro.statusCode || 200;
      return res.format({
        text: () => resFormatter.format('text', res, code, result),
        html: () => resFormatter.format('html', res, code, result),
        json: () => resFormatter.format('json', res, code, result),
        xml: () => resFormatter.format('xml', res, code, result),
        default: () => resFormatter.format('default', res, code, result)
      });
    }

    next();

  }

}

module.exports = exproFormatResult;