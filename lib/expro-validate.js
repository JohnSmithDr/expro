'use strict';

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

module.exports = validate;