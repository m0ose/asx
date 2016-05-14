'use strict';

System.register(['./util.js'], function (_export, _context) {
  var util;
  return {
    setters: [function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {

      // AgentSets are arrays that are factories for their agents/objects.
      // They are the base for Patches, Turtles and Links.

      const AgentSet = {
        // ### Array-like Methods

        // AgentSet "class method": Convert an array to an agentset.
        // This is a constructor for an AgentSet.
        // It also is used in AgentSet methods which call an Array function
        // returning a new Array, to turn it back into an AgentSet.
        // See clone() below.
        AsSet(array, set = AgentSet) {
          if (this.hasOwnProperty('length')) util.error('AsSet: called from AgentSet method, use this.asSet');
          return util.setPrototypeOf(array, set);
        },
        // AgentSet method to convert an array to the same AgentSet type as this's.
        // Always called with "this": this.asSet(array). Mainly used when
        // an AgentSet method calls this.someArrayMethod which returns a new array.
        asSet(array) {
          if (!this.hasOwnProperty('length')) util.error('asSet: not called from AgentSet method, use AgentSet.AsSet');
          return AgentSet.AsSet(array, Object.getPrototypeOf(this));
        },

        // Return true if there are no items in this set, false if not empty.
        empty() {
          return this.length === 0;
        },
        // Return !empty()
        any() {
          return this.length !== 0;
        },
        // Return last item in this array. Returns undefined if empty.
        last() {
          return this[this.length - 1];
        },
        // Return true if reporter true for all of this set's objects
        all(reporter) {
          return this.every(reporter);
        },

        // Return shallow copy of a protion of this agentset
        // [See Array.slice](https://goo.gl/Ilgsok)
        // Default is to clone entire agentset
        clone(begin = 0, end = this.length) {
          return this.asSet(this.slice(begin, end));
        },
        // Return this agentset sorted by the reporter in ascending/descending order.
        // If reporter is a string, convert to a fcn returning that property
        sortBy(reporter, ascending = true) {
          util.sortObjs(this, reporter, ascending);
          return this;
        },

        // Return a random agent. Return undefined if empty.
        oneOf() {
          return this[util.randomInt(this.length)];
        },
        // Return the first agent having the min/max of given value of f(agent).
        // If reporter is a string, convert to a fcn returning that property
        minOrMaxOf(min, reporter) {
          if (this.empty()) util.error('min/max OneOf: empty array');
          if (typeof reporter === 'string') reporter = util.propFcn(reporter);
          let o = null;
          let val = min ? Infinity : -Infinity;
          for (let i = 0; i < this.length; i++) {
            let a = this[i];
            let aval = reporter(a);
            if (min && aval < val || !min && aval > val) [o, val] = [a, aval];
          }
          return o;
        },
        // The min version of the above
        minOneOf(reporter) {
          return this.minOrMaxOf(true, reporter);
        },
        // The max version of the above
        maxOneOf(reporter) {
          return this.minOrMaxOf(false, reporter);
        },

        // Return n random agents.
        // See [Fisher-Yates-Knuth shuffle](https://goo.gl/fWNFf)
        // for better approach for large n.
        nOf(n) {
          // I realize this is a bit silly, lets hope random doesn't repeat!
          if (n > this.length) util.error('nOf: n larger than agentset');
          if (n === this.length) return this;
          const result = [];
          while (result.length < n) {
            const o = this.oneOf();
            if (!(o in result)) result.push(o);
          }
          return result;
        },
        // Return a new agentset of the n min/max agents of the value of reporter,
        // in ascending order.
        // If reporter is a string, convert to a fcn returning that property
        // Note we do not manage ties, see NetLogo docs.
        minOrMaxNOf(min, n, reporter) {
          if (n > this.length) util.error('min/max nOf: n larger than agentset');
          const as = this.clone().sortBy(reporter);
          return min ? as.clone(0, n) : as.clone(as.length - n);
        },
        minNOf(n, reporter) {
          return this.minOrMaxNOf(true, n, reporter);
        },
        maxNOf(n, reporter) {
          return this.minOrMaxNOf(false, n, reporter);
        }

      };
      util.setPrototypeOf(AgentSet, Array.prototype);

      // AgentSet.__proto__ = Array.prototype

      _export('default', AgentSet);
    }
  };
});