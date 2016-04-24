'use strict';

System.register(['./util.js'], function (_export, _context) {
  var util;
  return {
    setters: [function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {

      class Agent {
        constructor(myAgentSet) {
          this.myAgentSet = myAgentSet;
        }
        getDefaultable(name) {
          return this[name] || this.myAgentSet.defaults[name];
        }
        setDefaultable(name, value) {
          // allow overriding for debugging/interactivity
          const override = this[name];
          const defaultValue = this.myAgentSet.defaults[name];
          if (override && defaultValue && defaultValue === value) delete this[name];else this[name] = value;
        }
        getColor() {
          return this.getDefaultable('color');
        }
        setColor(color) {
          this.setDefaultable('color', color);
        } // overridable
      } /* eslint no-console: 0 */


      class AgentSet extends Array {
        constructor() {
          super();
          this.defaults = {};
          this.defaultsOverridable = false;
        }
        create() {
          this.push(new Agent(this));return this[this.length - 1];
        }
        setDefault(name, value) {
          this.defaults[name] = value;
        }
      }

      util.copyTo(window, { Agent, AgentSet, util });

      const as = window.as = new AgentSet();
      as.setDefault('color', 'red');
      const a = window.a = as.create();

      util.copyTo(window, { as, a });

      console.log('a.color', a.getColor());
      util.pps(as, 'as');
      util.pps(a, 'a');
    }
  };
});