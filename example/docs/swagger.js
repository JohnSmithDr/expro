'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const mount = (filename) => yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, filename), 'utf8'));

/**
 *
 * @param {object} opts
 * @param {string} opts.spec
 * @param {Array|string} [opts.apis]
 */
const swaggerDoc = (opts) => {

  let spec = mount(opts.spec);
  let apis = typeof opts.apis === 'string' ? [opts.apis] : opts.apis;

  if (Array.isArray(apis) && apis.length) {
    
    spec = apis.reduce((dest, filename) => {
      let doc = mount(filename);
      dest.paths = Object.assign(dest.paths || {}, doc.paths || {});
      dest.parameters = Object.assign(dest.parameters || {}, doc.parameters || {});
      dest.definitions = Object.assign(dest.definitions || {}, doc.definitions || {});
      dest.responses = Object.assign(dest.responses || {}, doc.responses || {});
      if (Array.isArray(doc.tags) && doc.tags.length) dest.tags =  (dest.tags || []).concat(doc.tags);
      return dest;

    }, spec);
  }

  return spec;

};

module.exports = swaggerDoc({
  spec: 'swagger.yml',
  apis: [
    'api-index.yml',
    'api-users.yml',
    'api-goods.yml',
    'api-orders.yml'
  ]
});