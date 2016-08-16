'use strict';

/**
 * Use native promise by default.
 *
 * @type {Promise}
 * @private
 */
let __Promise = Promise;

/**
 * Start async process by construct a new promise.
 *
 * @param handler
 * @returns {Promise}
 */
function exproAsync(handler) {
  return new __Promise((resolve, reject) => {
    handler((err, r) => err ? reject(err) : resolve(r));
  });
}

/**
 * Use promise constructor.
 *
 * @param {Promise} promiseConstructor
 */
exproAsync.use = function (promiseConstructor) {
  __Promise = promiseConstructor;
};

module.exports = exproAsync;