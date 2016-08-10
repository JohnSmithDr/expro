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

const require = (context, key, msg) => validate(
  x => x[context][key],
  x => {
    if (x === undefined)
      throw _error(msg || `Parameter: ${key} in ${context} is required`);
  });

const notNull = (context, key, msg) => validate(
  x => x[context][key],
  x => {
    if (x === null)
      throw _error(msg || `Parameter: ${key} in ${context} should not be null`);
  });

const notEmpty = (context, key, msg) => validate(
  x => x[context][key],
  x => {
    if (typeof x === 'string' && x.length === 0)
      throw _error(msg || `Parameter: ${key} in ${context} should not be empty`);
  });

const match = (context, key, pattern, msg) => validate(
  x => x[context][key],
  x => {
    if (typeof x === 'string' && !pattern.test(x))
      throw _error(msg || `Parameter: ${key} in ${context} should match pattern: ${pattern.toString()}`);
  });