'use strict';

const PROP_PATH_REGEX = /^([^\.\s]+)(\.[^\.\s]+)*$/;

/**
 * Map anything to undefined.
 */
const defaultSelector = () => {};

/**
 * Return a function to map source to specific property path.
 * If the given arg is not a valid path, it returns the defaultSelector.
 *
 * @example
 *
 *   pathSelector('foo.bar')({ foo: { bar: 'you found me' } });
 *
 *   // -> 'you found me'
 *
 * @param {string} path
 * @returns {function}
 * @private
 */
const pathSelector = (path) => {

  if (!(typeof path === 'string' && path && PROP_PATH_REGEX.test(path))) {
    return defaultSelector;
  }

  let props = path.split('.');

  return function propPathSelector(x) {
    return props.reduce((src, prop) => {
      if (src && src.hasOwnProperty && src.hasOwnProperty(prop)) return src[prop];
    }, x);
  };

};

/**
 * Resolve anything to a expro selector.
 *
 * @param x
 * @returns {function}
 */
const resolve = (x) => {
  let type = typeof x;
  if (type === 'function') return x;
  if (type === 'string') return pathSelector(x);
  return defaultSelector;
};

/**
 * Resolve selectors from array.
 *
 * @param {Array} arr
 * @returns {Array}
 */
const fromArray = (arr) => arr.map(resolve);

module.exports = { defaultSelector, pathSelector, resolve, fromArray };