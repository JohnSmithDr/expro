'use strict';

const expect = require('chai').expect;

const expro = require('../lib');

describe('expro.with()', function () {

  it('should be return the with selector context', function () {

    let mock = {
      query: { foo: 'bar' },
      body: { foo: 'bar' }
    };

    let ctx = expro.with(x => x.query, x => x.body);

    expect(ctx._selectors).to.be.an('array').and.have.length(2);

    ctx._selectors.forEach(s => {
      expect(s).to.be.a('function');
      expect(s(mock)).to.deep.equal({ foo: 'bar' });
    });

  });

  it('should throw error for empty selectors', function () {
    
    expect(() => expro.with()).to.throw(/selectors must be an array/);

  });

});