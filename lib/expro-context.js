'use strict';

function ExproContext(x) {
  this._ctx = x;
}

ExproContext.of = function (x) {
  return new ExproContext(x);
};

ExproContext.in = function (x) {
  return ExproContext.of({ in: x });
};

/**
 * Merge and return new context.
 * @param {object} x
 * @returns {ExproContext}
 */
function merge (x) {
  return ExproContext.of(Object.assign({}, this._ctx, x));
}

/**
 * Returns context with specific property.
 * @param {string} x
 * @returns {ExproContext}
 */
function prop(x) {
  return merge.call(this, { prop: x });
}

/**
 * Merge validator to validation context.
 * @param {string} flag
 * @param {object} val
 * @param {string} [msg]
 */
function mergeValidation(flag, val, msg) {
  let validation = Object.assign({}, this._ctx.validation || {}, { [flag]: val });
  validation.messages = Object.assign({}, validation.messages || {}, { [flag]: msg });
  return merge.call(this, { validation });
}

/**
 * Build context/value validation middleware.
 *
 * @example
 *
 *   expro.body.prop('foo').validate(foo => {
 *     if (foo !== 'foo') throw Error('foo must be "foo"');
 *   });
 *
 *   expro.body.validate(body => {
 *     if (body.foo !== 'foo') throw Error('body.foo must be "foo"');
 *   });
 *
 * @param {function} validator
 * @returns {function}
 */
function validate(validator) {
  let ctx = this._ctx;
  return function validationMiddleware(req, res, next) {
    let val = ctx.prop ? req[ctx.in][ctx.prop] : req[ctx.in];
    try {
      validator(val);
      return next();
    }
    catch(err) {
      return next(err);
    }
  }
}

/**
 * Return context to build property required validation.
 * @param {string} [msg] - message for validation failed.
 * @returns {ExproContext}
 */
function require(msg) {
  return mergeValidation.call(this, 'require', true, msg);
}

/**
 * Return context to build value not-null validation.
 * @param {string} [msg] - message for validation failed.
 * @returns {ExproContext}
 */
function notNull(msg) {
  return mergeValidation.call(this, 'notNull', true, msg);
}

/**
 * Return context to build string not-empty validation.
 * @param {string} [msg] - message for validation failed.
 * @returns {ExproContext}
 */
function notEmpty(msg) {
  return mergeValidation.call(this, 'notEmpty', true, msg);
}

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

function toInt(defaultValue) {
  return convert.call(this, Number.parseInt, defaultValue);
}

function toNumber(defaultValue) {
  return convert.call(this, Number.parseFloat, defaultValue);
}

ExproContext.prototype = {
  prop,
  validate, require, notNull, notEmpty,
  convert, toInt, toNumber
};

module.exports = ExproContext;