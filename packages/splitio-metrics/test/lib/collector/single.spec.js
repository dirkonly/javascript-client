'use strict';

var tape = require('tape');
var collectorFactory = require('../../../lib/collector/single');

tape('SINGLE COLLECTOR / should implement a secuencia counter', function (assert) {
  var c = collectorFactory();

  c.track();c.track();c.track();

  assert.true(c.counters() === 3, 'counter should be 3');
  assert.end();
});

tape('SINGLE COLLECTOR / should start from 0 after clear call', function (assert) {
  var c = collectorFactory();

  c.track();c.track();c.track();c.clear();

  assert.true(c.counters() === 0, 'counter is 0');
  assert.end();
});

tape('SINGLE COLLECTOR / should support custom toJSON method', function (assert) {
  var c = collectorFactory();
  var hooked = JSON.stringify(c);
  var manual = JSON.stringify(c.counters());

  assert.true(hooked === manual, 'toJSON should expose the counters as an array of numbers');
  assert.end();
});
//# sourceMappingURL=single.spec.js.map