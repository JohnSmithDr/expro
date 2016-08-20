'use strict';

function ErrorFormatter(formatter) {
  this._formatter = formatter;
}

ErrorFormatter.prototype = {
  format: function (type, res, err) {
    let fn = (typeof this._formatter[type] === 'function')
      ? this._formatter[type]
      : this._formatter['default'];
    if (typeof fn !== 'function') throw Error('No available formatter');
    fn(res, err);
  }
};

/**
 * Create middleware to send formatted error result.
 *
 * @param {object} [formatter]
 * @return {function}
 */
function exproFormatError(formatter) {

  let errFormatter = new ErrorFormatter(formatter || {
      json: (res, err) => {
        let code = err.statusCode || err.status || 500;
        let error = {
          code: err.errorCode || err.code,
          message: err.message
        };
        res.status(code).json({ error });
      },
      default: (res, err) => {
        res.status(406).send('Not Acceptable');
      }
    });

  return function exproFormatErrorMiddleware(err, req, res, next) {
    return res.format({
      text: () => errFormatter.format('text', res, err),
      html: () => errFormatter.format('html', res, err),
      json: () => errFormatter.format('json', res, err),
      xml: () => errFormatter.format('xml', res, err),
      default: () => errFormatter.format('default', res, err)
    });
  }

}

module.exports = exproFormatError;