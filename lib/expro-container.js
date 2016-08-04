'use strict';

// expro.header('foo')  -> header container
// expro.param('foo')   -> param container
// expro.query('foo')   -> query container
// expro.body('foo')    -> body container

function ExproContainer(x) {
  this._x = x;
}

function value(req) {
  let x = this._x;
  if (x.in === 'headers') return req.get(x.key);
  if (x.in) return req[x.in][x.key];
  return req.body[x] || req.query[x] || req.params[x] || req.get(x);
}

ExproContainer.prototype = { value };

ExproContainer.key = (key) => new ExproContainer(key);

ExproContainer.header = (key) => new ExproContainer({ key, in: 'headers' });

ExproContainer.param = (key) => new ExproContainer({ key, in: 'params'});

ExproContainer.query = (key) => new ExproContainer({ key, in: 'query'});

ExproContainer.body = (key) => new ExproContainer({ key, in: 'body'});