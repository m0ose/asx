'use strict';

System.register([], function (_export, _context) {
  var _slicedToArray, _createClass, OofA;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _slicedToArray = function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;

          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);

              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"]) _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }

          return _arr;
        }

        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();

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

      OofA = function () {
        // The constructor has three parameters:
        //
        // arraySpecs: Define the Object's data arrays.
        // The arrays can be TypedArrays, standard JavaScript Arrays, or constants.
        //
        // initSize: the initial size used for [TypedArrays](https://goo.gl/3OOQzy)
        //
        // sizeDelta: how much to grow the TypedArrays when they overflow.

        function OofA(arraySpecs) {
          var initSize = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
          var sizeDelta = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];

          _classCallCheck(this, OofA);

          // arraySpec details: Three forms are used.
          //
          // The "key" is the name of the array. The values are brackets specifying
          // formats for the Object's arrays.
          // * key: [arrayType, 1] - key is a simple array of given type.
          //   A shortcut is key: arrayType .. w/o the brackets.
          // * key: [arrayType, num] - name is an array of arrays of num elements
          //   arrayType has to be a typed array. If Array is to contain arrays,
          //   they should be array objects of size num, not num elements from array.
          // * key: [value, 0] - name is a constant value, not an array of values.

          this.length = 0;
          this.size = 0;
          this.specs = {};
          this.initSize = initSize;
          this.sizeDelta = sizeDelta;
          this.arrays = {};
          this.initArrays(arraySpecs);
        }

        _createClass(OofA, [{
          key: 'initArrays',
          value: function initArrays(arraySpecs) {
            for (var key in arraySpecs) {
              // eslint-disable-line guard-for-in
              var val = arraySpecs[key];
              if (!Array.isArray(val)) val = [val, 1];
              var _val = val;

              var _val2 = _slicedToArray(_val, 2);

              var Type = _val2[0];
              var elements = _val2[1];
              // type caps: a ctor
              this.specs[key] = { Type: Type, elements: elements };

              if (Type === Array && elements !== 1) throw 'OofA initArrays: JavaScript Arrays must have "elements" = 1';

              if (elements === 0) this.arrays[key] = Type;else this.arrays[key] = new Type(this.initSize * elements);
            }
            this.size = this.initSize;
          }
        }, {
          key: 'extendArrays',
          value: function extendArrays() {
            this.size += this.sizeDelta;
            for (var key in this.arrays) {
              var _specs$key = this.specs[key];
              var // eslint-disable-line guard-for-in
              Type = _specs$key.Type;
              var elements = _specs$key.elements;

              if (elements === 0) continue;

              var array = this.arrays[key];
              if (Type === Array) {
                array[this.size - 1] = undefined; // continue? sparse querks?
              } else {
                  this.arrays[key] = new Type(this.size * elements);
                  this.arrays[key].set(array);
                }
            }
          }
        }, {
          key: 'arrayNames',
          value: function arrayNames() {
            return Object.keys(this.arrays);
          }
        }, {
          key: 'getSubArrayAt',
          value: function getSubArrayAt(ix, key) {
            var array = this.arrays[key];
            var elements = this.specs[key].elements;

            if (elements < 2) throw 'getSubArrayAt: ' + key + ' not a subarray';
            var start = ix * elements;
            var end = start + elements;
            return array.subarray(start, end);
          }
        }, {
          key: 'setSubArrayAt',
          value: function setSubArrayAt(ix, key, val) {
            var array = this.arrays[key];
            var elements = this.specs[key].elements;

            if (elements < 2) throw 'setSubArrayAt: ' + key + ' not a subarray';
            if (val.length !== elements) throw 'setSubArrayAt: value not an array of ' + elements + ' elements';
            array.set(val, ix * elements);
          }
        }, {
          key: 'getValueAt',
          value: function getValueAt(ix, key) {
            var elements = this.specs[key].elements;

            var array = this.arrays[key];
            if (elements === 0) return array;
            if (elements === 1) return array[ix];
            return this.getSubArrayAt(ix, key);
          }
        }, {
          key: 'setValueAt',
          value: function setValueAt(ix, key, val) {
            var elements = this.specs[key].elements;

            var array = this.arrays[key];
            if (elements === 0) {
              this.arrays[key] = val;return;
            }
            if (elements === 1) {
              array[ix] = val;return;
            }
            this.setSubArrayAt(ix, key, val);
          }
        }, {
          key: 'getObject',
          value: function getObject(ix) {
            var obj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            // const obj = {}
            for (var key in this.arrays) {
              // eslint-disable-line guard-for-in
              obj[key] = this.getValueAt(ix, key);
            }return obj;
          }
        }, {
          key: 'setObject',
          value: function setObject(arrayValues, ix) {
            for (var key in arrayValues) {
              // eslint-disable-line guard-for-in
              this.setValueAt(ix, key, arrayValues[key]);
            }
          }
        }, {
          key: 'pushObject',
          value: function pushObject(arrayValues) {
            if (this.length === this.size) this.extendArrays();
            this.setObject(arrayValues, this.length);
            this.length++;
          }
        }, {
          key: 'getterSetter',
          value: function getterSetter() {
            var _this = this;

            var obj = { ix: 0 };
            var arrays = this.arrays;

            var _loop = function _loop(key) {
              var // eslint-disable-line guard-for-in
              elements = _this.specs[key].elements;

              if (elements === 0) Object.defineProperty(obj, key, {
                get: function get() {
                  return arrays[key];
                },
                set: function set(val) {
                  arrays[key] = val;
                }
              });
              if (elements === 1) Object.defineProperty(obj, key, {
                get: function get() {
                  return arrays[key][obj.ix];
                },
                set: function set(val) {
                  arrays[key][obj.ix] = val;
                }
              });
              if (elements > 1) Object.defineProperty(obj, key, {
                get: function get() {
                  return arrays[key].subarray(obj.ix * elements, (obj.ix + 1) * elements);
                },
                set: function set(val) {
                  return arrays[key].set(val, obj.ix * elements);
                }
              });
            };

            for (var key in arrays) {
              _loop(key);
            }
            return obj;
          }
        }, {
          key: 'accessor',
          value: function accessor(gs, ix) {
            gs.ix = ix;return gs;
          }
        }]);

        return OofA;
      }();

      _export('default', OofA);
    }
  };
});
//# sourceMappingURL=OofA.js.map