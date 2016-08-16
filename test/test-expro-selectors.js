'use strict';

const expect = require('chai').expect;

const selectors = require('../lib/expro-selectors');

describe('expro-selectors', function () {

  describe('.defaultSelector()', function () {

    it('should returns undefined', function () {

      expect(selectors.defaultSelector).to.be.a('function');
      expect(selectors.defaultSelector()).to.be.undefined;

    });

  });

  describe('.pathSelector()', function () {

    it('should returns a function', function () {

      expect(selectors.pathSelector).to.be.a('function');
      expect(selectors.pathSelector('a')).to.be.a('function');

    });

    it('should return defaultSelector for invalid path', function () {

      let test = (path) => {
        let selector = selectors.pathSelector(path);
        expect(selector).to.be.a('function');
        expect(selector()).to.be.undefined;
      };

      let cases = [
        '',
        '.',
        '..',
        '.bad',
        '.bad.',
        '.bad..',
        'bad.',
        'bad..',
        'bad..too',
        'bad..too..',
        'bad ',
        'bad too',
        'bad too ',
        'bad too  ',
        'bad\ttoo..',
        'bad\ttoo\t',
        'bad\r\ntoo\r\n',
        '\t',
        '\r\n'
      ];

      cases.forEach(test);

    });

    it('should return propPathSelector for valid path', function () {

      let test = (path) => {
        let selector = selectors.pathSelector(path);
        expect(selector).to.be.a('function');
        expect(selector.name).to.equal('propPathSelector');
      };

      let cases = [
        'a',
        'a.b',
        'a.b.c',
        '_a',
        '_a.$b',
        '_a.$b.~c',
        '_a.$b.~c.^d'
      ];

      cases.forEach(test);

    });

    it('should select value by path', function () {

      let test = (path, src, expected) => {
        expect(selectors.pathSelector(path)(src)).to.deep.equal(expected);
      };

      let cases = [
        [ 'foo', { foo: 'bar' }, 'bar' ],
        [ 'foo.bar', { foo: { bar: 'gee' } }, 'gee' ],
        [ 'foo.bar.gee', { foo: { bar: { gee: 'you found me' } } }, 'you found me' ],
      ];

      cases.forEach(x => test.apply(this, x));

    });

  });

  describe('.resolve()', function () {

    it('should resolve function', function () {
      let fn = x => x;
      expect(selectors.resolve(fn)).to.equal(fn);
    });

    it('should resolve property path', function () {
      let selector = selectors.resolve('foo.bar');
      expect(selector).to.be.a('function');
      expect(selector.name).to.equal('propPathSelector');
    });

    it('should resolve invalid property path to default selector', function () {
      let selector = selectors.resolve('..foo');
      expect(selector).to.be.a('function');
      expect(selector()).to.be.undefined;
    });

    it('should resolve anything else to default selector', function () {

      let test = (x) => {
        let selector = selectors.resolve(x);
        expect(selector).to.be.a('function');
        expect(selector()).to.be.undefined;
      };

      let cases = [ '', 123, [], {}, true, false ];

      cases.forEach(test);

    });

  });

  describe('.fromArray', function () {

  });
  

});