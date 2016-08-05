'use strict';

const convert = (context, key, converter, defaultValue) => (req, res, next) => {
  if (req[context][key] !== undefined) {
    req[context][key] = converter(req[context][key]) || defaultValue;
  }
  return next();
};

const toInt = (context, key, defaultValue) => convert(context, key, x => Number.parseInt, defaultValue);

const toNumber = (context, key, defaultValue) => convert(context, key, x => Number.parseFloat, defaultValue);