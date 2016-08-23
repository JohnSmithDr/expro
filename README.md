# expro

[![Build Status](https://travis-ci.org/JohnSmithDr/expro.svg?branch=master)](https://travis-ci.org/JohnSmithDr/expro)

Build express middleware more expressive.

Install with:

```
npm install expro
```

And make a test:

```
npm test
```

## APIs

#### expro(fn1, fn2, fn3 ...)

To create middleware chain for express.

```js
let mw = expro(
  (req, res, next) => next(),
  (req, res, next) => next(),
  ...
  (req, res, next) => next(),
);

let app = express();
app.use(mw);
```

#### expro.async(fn)

To create promise for async process.

```js
expro
  .async(done => fs.readFile('./config', done))
  .then(content => {
    // do with file content ...
  });
```

#### expro.await(fn)

To create expro await middleware.

```js
expro.await(req => async(req));
```

#### expro.with(selector1, selector2, ...)

To create expro args selectors context.

```js
expro
  .with(x => x.params.id, x => x.body)
  .await((id, body) => async(id, body));
```

Or use property selectors:

```js
expro
  .with('params.id', 'body')
  .await((id, body) => async(id, body));
```

#### expro.header(field \[, value\])

To create middleware to write/overwrite response header.

```js
expro.header('Content-Type', 'text/plain');

expro.header({
  'Content-Type': 'text/plain',
  'Content-Length': '123'
});
```

#### expro.status(number)

To create middleware to write/overwrite response status code.

```js
expro(
  expro.await(req => async(req)),
  expro.status(201),
  expro.formatResult()
);
```

#### expro.mapResult(mapper)

To create middleware to map the result into another form.

```js
expro(
  expro.await(req => Promise.resolve({ foo: 'bar' })),
  expro.mapResult(s => {
    return { code: 'OK', data: s };
  }),
  expro.formatResult()
);

// -> { result: { code: 'OK', data: { foo: 'bar' } } }
```

#### expro.wrap(key)

To create middleware to wrap result in the given key.

```js
expro(
  expro.await(req => Promise.resolve({ foo: 'bar' })),
  expro.wrap('data'),
  expro.formatResult()
);

// -> { result: { data: { foo: 'bar' } } }
```

#### expro.formatResult(\[formatter\])

To create middleware to send formatted result. Default to send result in json.

```js
expro(
  expro.await(req => Promise.resolve({ foo: 'bar' })),
  expro.formatResult()
);

// -> { result: { foo: 'bar' } }
```

Can be use as application-level middleware:

```js
let app = express();

app.get('/', expro.await(req => Promise.resolve({ foo: 'bar' })));

app.use(expro.formatResult());
```

And with customized formatter:

```js
let app = express();

app.get('/', expro.await(req => Promise.resolve({ foo: 'bar' })));

app.use(expro.formatResult({
  json: (res, result) => {
    res.json({ code: res.statusCode, data: result });
  },
  xml: (res, result) => {
    let json = {
      code: res.statusCode,
      data: result
    };
    let xml = xmlParser.toXml(json);
    res.send(xml);
  },
  default: (res, result) => {
    res.status(406).send('Not Acceptable');
  }
}));
```

#### expro.formatError(\[formatter\])

Create middleware to send formatted error result. Default to send error in json.

```js
expro(
  expro.await(req => Promise.reject(Error('oops'))),
  expro.formatError()
);

// -> { error: { message: 'oops' } }
```

Can be use as application-level middleware:

```js
let app = express();

app.get('/', expro.await(req => Promise.reject(Error('oops'))));

app.use(expro.formatError());
```

And with customized formatter:

```js
let app = express();

app.get('/', expro.await(req => Promise.reject(Error('oops'))));

app.use(expro.formatError({
  json: (err, result) => {
    res.status(err.statusCode).send({
      code: err.statusCode,
      error_message: err.message
    });
  },
  xml: (res, result) => {
    let json = {
      code: err.statusCode,
      error_message: err.message
    };
    let xml = xmlParser.toXml(json);
    res.status(err.statusCode).send(xml);
  },
  default: (res, result) => {
    res.status(406).send('Not Acceptable');
  }
}));
```

## License

MIT