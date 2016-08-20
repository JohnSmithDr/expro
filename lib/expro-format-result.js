'use strict';

function ResultFormatter(formatter) {
  this._formatter = formatter;
}

ResultFormatter.prototype = {
  format: function (type, res, result) {
    let fn = (typeof this._formatter[type] === 'function')
      ? this._formatter[type]
      : this._formatter['default'];
    if (typeof fn !== 'function') throw Error('No available formatter');
    fn(res, result);
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
      json: (res, result) => res.json({ result }),
      default: (res, result) => res.status(406).send('Not Acceptable')
    });

  return function exproFormatResultMiddleware(req, res, next) {

    if (res.hasOwnProperty('expro') && res.expro.hasOwnProperty('result')) {
      let result = res.expro && res.expro.result;
      return res.format({
        text: () => resFormatter.format('text', res, result),
        html: () => resFormatter.format('html', res, result),
        json: () => resFormatter.format('json', res, result),
        xml: () => resFormatter.format('xml', res, result),
        default: () => resFormatter.format('default', res, result)
      });
    }

    next();

  }

}

module.exports = exproFormatResult;