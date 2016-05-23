'use strict';

System.register(['./util.js'], function (_export, _context) {
  var util, agentObject, ID, defaults, a, b;

  function setDefault(key, value) {
    defaults[key] = value;
  }
  // The agent creation function
  function createAgent() {
    var obj = Object.create(defaults);
    obj.setID(ID++);
    return obj;
  }

  return {
    setters: [function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {
      agentObject = {
        setID: function setID(id) {
          this.id = id;
        },
        setxy: function setxy(x, y) {
          this.x = x;this.y = y;
        },
        getColor: function getColor() {
          return this.color;
        }
      };
      ID = 0;
      defaults = Object.create(agentObject);
      a = createAgent();

      a.setxy(1, 2);setDefault('color', 'red');
      console.log(a.id, a.x, a.y, a.color, a.getColor());
      // 0 1 2 "red" "red"
      b = createAgent();

      b.setxy(3, 4);b.color = 'green';
      console.log(b.id, b.x, b.y, b.color, b.getColor());
      // 1 3 4 "green" "green"

      util.pps(a, 'a');
      util.pps(b, 'b');
      // pps(a, 'a')
      // pps(b, 'b')
    }
  };
});