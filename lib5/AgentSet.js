'use strict';

System.register(['./util.js'], function (_export, _context) {
  var util, AgentSet;
  return {
    setters: [function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {
      AgentSet = {
        AsSet: function AsSet(array) {
          var set = arguments.length <= 1 || arguments[1] === undefined ? AgentSet : arguments[1];

          if (this.hasOwnProperty('length')) util.error('AsSet: called from AgentSet method, use this.asSet');
          return util.setPrototypeOf(array, set);
        },
        asSet: function asSet(array) {
          if (!this.hasOwnProperty('length')) util.error('asSet: not called from AgentSet method, use AgentSet.AsSet');
          return AgentSet.AsSet(array, Object.getPrototypeOf(this));
        },
        empty: function empty() {
          return this.length === 0;
        },
        any: function any() {
          return this.length !== 0;
        },
        last: function last() {
          return this[this.length - 1];
        },
        all: function all(reporter) {
          return this.every(reporter);
        },
        clone: function clone() {
          var begin = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
          var end = arguments.length <= 1 || arguments[1] === undefined ? this.length : arguments[1];

          return this.asSet(this.slice(begin, end));
        },
        sortBy: function sortBy(reporter) {
          var ascending = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

          util.sortObjs(this, reporter, ascending);
          return this;
        },
        oneOf: function oneOf() {
          return this[util.randomInt(this.length)];
        },
        minOrMaxOf: function minOrMaxOf(min, reporter) {
          if (this.empty()) util.error('min/max OneOf: empty array');
          if (typeof reporter === 'string') reporter = util.propFcn(reporter);
          var o = null;
          var val = min ? Infinity : -Infinity;
          for (var i = 0; i < this.length; i++) {
            var a = this[i];
            var aval = reporter(a);
            if (min && aval < val || !min && aval > val) {
              ;
              o = a;
              val = aval;
            }
          }
          return o;
        },
        minOneOf: function minOneOf(reporter) {
          return this.minOrMaxOf(true, reporter);
        },
        maxOneOf: function maxOneOf(reporter) {
          return this.minOrMaxOf(false, reporter);
        },
        nOf: function nOf(n) {
          // I realize this is a bit silly, lets hope random doesn't repeat!
          if (n > this.length) util.error('nOf: n larger than agentset');
          if (n === this.length) return this;
          var result = [];
          while (result.length < n) {
            var o = this.oneOf();
            if (!(o in result)) result.push(o);
          }
          return result;
        },
        minOrMaxNOf: function minOrMaxNOf(min, n, reporter) {
          if (n > this.length) util.error('min/max nOf: n larger than agentset');
          var as = this.clone().sortBy(reporter);
          return min ? as.clone(0, n) : as.clone(as.length - n);
        },
        minNOf: function minNOf(n, reporter) {
          return this.minOrMaxNOf(true, n, reporter);
        },
        maxNOf: function maxNOf(n, reporter) {
          return this.minOrMaxNOf(false, n, reporter);
        }
      };

      util.setPrototypeOf(AgentSet, Array.prototype);

      _export('default', AgentSet);
    }
  };
});