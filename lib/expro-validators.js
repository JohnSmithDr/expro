'use strict';

const _error = (e) => {

  let err;

  if (e instanceof Error && e.errorType === 'ValidationError') {
    return e;
  }
  if (e instanceof Error) {
    err = Error(e.message);
    err.error = e;
  }
  else {
    err = Error(e);
  }

  err.errorType = 'ValidationError';
  return err;
};

const validate = (selector, validator) => (req, res, next) => {
  try {
    validator(selector(req));
    return next();
  }
  catch(err) {
    return next(_error(err));
  }
};

function ExproValidationContext(ctx) {
  this._ctx = ctx;
}

function key(x) {
  let ctx = Object.assign({}, this._ctx, { key: x });
  return new ExproValidationContext(ctx);
}

function mount() {
  return function (req, res, next) {

  }
}

function require(msg) {
  let ctx = Object.assign({}, this._ctx, { validators: { require: true }, messages: { require: msg } });
  return new ExproValidationContext(ctx);
}

function notNull() {
  
}

function notEmpty() {
  
}

function minLength() {

}

function maxLength() {
  
}

function minimum() {
  
}

function maximum() {
  
}

function within() {
  
}

function match() {
  
}



ExproValidationContext.params = () => new ExproValidationContext({ in: 'params'});
ExproValidationContext.query = () => new ExproValidationContext({ in: 'query' });
ExproValidationContext.body = () => new ExproValidationContext({ in: 'body' });

ExproValidationContext.prototype = { key, mount, require, notNull, notEmpty, match, };


const __require = (context, key, msg) => mount(
  x => x[context][key],
  x => {
    if (x === undefined)
      throw _error(msg || `Parameter: ${key} in ${context} is required`);
  });

const __notNull = (context, key, msg) => mount(
  x => x[context][key],
  x => {
    if (x === null)
      throw _error(msg || `Parameter: ${key} in ${context} should not be null`);
  });

const __notEmpty = (context, key, msg) => mount(
  x => x[context][key],
  x => {
    if (typeof x === 'string' && x.length === 0)
      throw _error(msg || `Parameter: ${key} in ${context} should not be empty`);
  });

const __match = (context, key, pattern, msg) => mount(
  x => x[context][key],
  x => {
    if (typeof x === 'string' && !pattern.test(x))
      throw _error(msg || `Parameter: ${key} in ${context} should match pattern: ${pattern.toString()}`);
  });