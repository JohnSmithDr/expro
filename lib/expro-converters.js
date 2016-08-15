'use strict';

/**
 * Create value conversion middleware.
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

/**
 * Create integer type value conversion middleware.
 * Short for:
 *
 *   convert(parseInt, defaultValue);
 *
 * @example
 *
 *   expro.query.prop('foo').toInt();     // default value to 0
 *   expro.query.prop('bar').toInt(10);   // default value to 10
 *
 * @param {object} [defaultValue] - default to 0
 * @returns {function}
 */
function toInt(defaultValue) {
  return convert.call(this, parseInt, defaultValue || 0);
}

/**
 * Create numeric type value conversion middleware.
 * Short for:
 *
 *   convert(parseFloat, defaultValue);
 *
 * @example
 *
 *   expro.query.prop('foo').toNumber();     // default value to 0
 *   expro.query.prop('bar').toNumber(10);   // default value to 10
 *
 * @param {object} [defaultValue] - default to 0
 * @returns {function}
 */
function toNumber(defaultValue) {
  return convert.call(this, parseFloat, defaultValue || 0);
}

module.exports = { convert, toInt, toNumber };