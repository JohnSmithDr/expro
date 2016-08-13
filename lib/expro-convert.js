'use strict';

/**
 * Build value conversion middleware.
 *
 * @example
 *
 *   expro.body.prop('foo').convert(foo => parseInt(foo));
 *   expro.body.prop('bar').convert(bar => parseInt(bar), 100);
 *
 * @param {function} converter
 * @param {object} [defaultValue]
 * @returns {function}
 */
function convert(converter, defaultValue) {
  let ctx = this._ctx;
  return function valueConversionMiddleware(req, res, next) {
    if (req[ctx.in][ctx.prop] !== undefined)
      req[ctx.in][ctx.prop] = converter(req[ctx.in][ctx.prop]) || defaultValue;
    return next();
  }
}

module.exports = convert;