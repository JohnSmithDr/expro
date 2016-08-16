'use strict';

const expro = require('../../lib');

let counter = 0;

module.exports.index = expro.await(
  req => Promise.resolve(`Hello World ${++counter}`)
);