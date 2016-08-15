'use strict';

/**
 * Convert value into boolean type.
 *
 * 'true' 'True' 'TRUE' 'yes' 'Yes' 'YES' '1' -> true
 * 'false' 'False' 'FALSE' 'no' 'No' 'NO' '0' -> false
 *
 * @param x - any value
 * @returns {*} - boolean value if conversion success, or undefined
 * @private
 */
const _toBool = (x) => {

  let type = typeof x,
      lower = type === 'string' ? x.toLowerCase() : null;

  if (type === 'string' && /^[+-]?(\d*\.)?\d+$/.test(x)) return parseFloat(x) ? true : false;
  if (type === 'string' && lower === 'true') return true;
  if (type === 'string' && lower === 'false') return false;
  if (type === 'string' && lower === 'yes') return true;
  if (type === 'string' && lower === 'no') return false;
  if (type === 'number') return x ? true : false;
  if (type === 'boolean') return x;

};

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
 *   expro.query.prop('foo').toInt();     // default value is 0
 *   expro.query.prop('bar').toInt(10);   // default value is 10
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
 *   expro.query.prop('foo').toNumber();      // default value is 0
 *   expro.query.prop('bar').toNumber(0.1);   // default value is 0.1
 *
 * @param {object} [defaultValue] - default to 0
 * @returns {function}
 */
function toNumber(defaultValue) {
  return convert.call(this, parseFloat, defaultValue || 0);
}

/**
 * Create boolean type value conversion middleware.
 *
 * @example
 *
 *   expro.query.prop('foo').toBool();        // default value is false
 *   expro.query.prop('bar').toBool(true);    // default value is true
 *
 * @param {object} [defaultValue] - default to false
 * @returns {function}
 */
function toBool(defaultValue) {
  return convert.call(this, _toBool, defaultValue || false);
}

module.exports = { convert, toInt, toNumber, toBool };