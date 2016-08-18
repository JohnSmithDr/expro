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

#### expro.header(field [, value])

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

## License

MIT