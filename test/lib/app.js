'use strict';

System.register(['lib/util.js'], function (_export, _context) {
  var util;
  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }],
    execute: function () {
      window.util = util;
      util.toWindow({ util, pps: util.pps });
      // import {pps} from './util.js'

      // Case 3: Prototypal Inheritance Stack
      // Prototypal Agent Methods

      const agentObject = { // agent prototype
        setID(id) {
          this.id = id;
        },
        setxy(x, y) {
          this.x = x;this.y = y;
        },
        getColor() {
          return this.color;
        }
      };
      // AgentSet Contains these
      let ID = 0;
      // An empty defaults obj w/ agentObject as proto
      const defaults = Object.create(agentObject);
      function setDefault(key, value) {
        defaults[key] = value;
      }
      // The agent creation function
      function createAgent() {
        const obj = Object.create(defaults);
        obj.setID(ID++);
        return obj;
      }

      const a = createAgent();
      a.setxy(1, 2);setDefault('color', 'red');
      console.log(a.id, a.x, a.y, a.color, a.getColor());
      // 0 1 2 "red" "red"
      const b = createAgent();
      b.setxy(3, 4);b.color = 'green';
      console.log(b.id, b.x, b.y, b.color, b.getColor());
      // 1 3 4 "green" "green"

      util.pps(a, 'a');
      util.pps(b, 'b');
      // pps(a, 'a')
      // pps(b, 'b')

      class DataSet6 {
        constructor(width, height, data) {
          if (data.length !== width * height) util.error(`new DataSet length: ${ data.length } !== ${ width } * ${ height }`);else [this.width, this.height, this.data] = [width, height, data];
        }
      }
      class DataSet5 {
        constructor(width, height, data) {
          if (data.length !== width * height) {
            util.error(`new DataSet length: ${ data.length } !== ${ width } * ${ height }`);
          } else {
            this.width = width;
            this.height = height;
            this.data = data;
          }
        }
      }

      let w = 100,
          h = 100,
          d = new Array(w * h),
          num = 1e5;
      util.timeit(i => new DataSet6(w, h, d), num);
      util.timeit(i => new DataSet5(w, h, d), num);
    }
  };
});