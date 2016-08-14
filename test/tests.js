'use strict';

describe('expro', function () {

  it('should be ok', function () {
    console.log('ok');
  });

  require('./test-expro-await');

  require('./test-expro-json');

  require('./test-expro-context');

  require('./test-expro');

});