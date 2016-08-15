'use strict';

const converters = require('./expro-converters');
const validate = require('./expro-validate');

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
 * Return context to build property required validation.
 * @param {string} [msg] - message for validation failed.
 * @returns {ExproContext}
 */
function required(msg) {
  return mergeValidation.call(this, 'required', true, msg);
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

ExproContext.prototype = Object.assign({}, { prop, validate }, converters);

module.exports = ExproContext;