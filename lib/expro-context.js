'use strict';

function ExproContext(x) {
  this._ctx = x;
}

ExproContext.of = function (x) {
  return new ExproContext(x);
};

/**
 * Return context with key.
 * @param {string} x
 * @returns {ExproContext}
 */
ExproContext.key = function(x) {
  return ExproContext.of({ key: x });
};

/**
 * @param {string} x
 * @returns {ExproContext}
 */
function inContext(x) {
  return ExproContext.of(Object.assign({}, this._ctx, { in: x }));
}

/**
 * Return context with query.
 * @returns {ExproContext}
 */
function inQuery() {
  return inContext.call(this, 'query');
}

/**
 * Return context with body.
 * @returns {ExproContext}
 */
function inBody() {
  return inContext.call(this, 'body');
}

/**
 * Return context with params
 * @returns {ExproContext}
 */
function inParams() {
  return inContext.call(this, 'params');
}

/**
 * Return context with require validation.
 * @param {string} [msg] - message for notification when validation failed.
 * @returns {ExproContext}
 */
function require(msg) {
  return ExproContext.of(_mergeValidator(this._ctx, 'require', true, msg));
}

/**
 * Return context with not-null validation.
 * @param {string} [msg] - message for notification when validation failed.
 * @returns {ExproContext}
 */
function notNull(msg) {
  return ExproContext.of(_mergeValidator(this._ctx, 'notNull', true, msg));
}

/**
 * Return context with string not-empty validation.
 * @param {string} [msg] - message for notification when validation failed.
 * @returns {ExproContext}
 */
function notEmpty(msg) {
  return ExproContext.of(_mergeValidator(this._ctx, 'notEmpty', true, msg));
}

ExproContext.prototype = { inQuery, inBody, inParams, require, notNull, notEmpty };

/**
 * Merge validator to validation context.
 * @param {object} src - source context
 * @param {string} validator - validator name
 * @param {*} val - validator action
 * @param {string} [msg] - message for notification when validation failed.
 * @returns {object}
 * @private
 */
function _mergeValidator(src, validator, val, msg) {
  let validators = Object.assign({}, src.validators || {}, { [validator]: val });
  let messages = Object.assign({}, src.messages || {}, { [validator]: msg });
  return Object.assign({}, src, { validators, messages });
}

module.exports = ExproContext;