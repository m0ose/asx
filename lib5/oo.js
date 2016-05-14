'use strict';

System.register(['./util.js'], function (_export, _context) {
  var util, _createClass, Agent, AgentSet, as, a;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      Agent = function () {
        function Agent(myAgentSet) {
          _classCallCheck(this, Agent);

          this.myAgentSet = myAgentSet;
        }

        _createClass(Agent, [{
          key: 'getDefaultable',
          value: function getDefaultable(name) {
            return this[name] || this.myAgentSet.defaults[name];
          }
        }, {
          key: 'getColor',
          value: function getColor() {
            return this.getDefaultable('color');
          }
        }, {
          key: 'setColor',
          value: function setColor(color) {
            this.color = color;
          }
        }]);

        return Agent;
      }();

      AgentSet = function (_Array) {
        _inherits(AgentSet, _Array);

        function AgentSet() {
          _classCallCheck(this, AgentSet);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AgentSet).call(this));

          _this.defaults = {};
          return _this;
        }

        _createClass(AgentSet, [{
          key: 'create',
          value: function create() {
            this.push(new Agent(this));return this[this.length - 1];
          }
        }, {
          key: 'setDefault',
          value: function setDefault(name, value) {
            this.defaults[name] = value;
          }
        }]);

        return AgentSet;
      }(Array);

      // let p = { x: 1 }
      // if (p.x / 4 % 2) {
      //   p.color = [255, 0, 255] }
      // else {
      //   p.color = [Math.random() * 255, Math.random() * 255, Math.random() * 255] }

      util.copyTo(window, { Agent: Agent, AgentSet: AgentSet, util: util });

      as = window.as = new AgentSet();

      as.setDefault('color', 'red');
      a = window.a = as.create();


      util.copyTo(window, { as: as, a: a });

      console.log('a.color', a.getColor());
      util.pps(as, 'as');
      util.pps(a, 'a');
    }
  };
});
//# sourceMappingURL=oo.js.map