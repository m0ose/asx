'use strict';

System.register(['./util.js'], function (_export, _context) {
  var util, _slicedToArray, _createClass, OofA;

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
        // * specs: Define the Object's data arrays.
        // The arrays can be TypedArrays, standard JavaScript Arrays, or constants.
        // * initSize: the initial size used for [TypedArrays](https://goo.gl/3OOQzy)
        // * sizeDelta: how much to grow the TypedArrays when they overflow.
        // Use zero for static arrays

        function OofA(arraySpecs) {
          var initSize = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
          var deltaSize = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];

          _classCallCheck(this, OofA);

          // arraySpec details: Three forms are used.
          //
          // The "key" is the name of the array. The values are brackets specifying
          // formats for the Object's arrays.
          // * key: [value, 0] - name is a constant value, not an array of values.
          // * key: [arrayType, 1] - key is a simple array of given type.
          //   A shortcut is key: arrayType .. w/o the brackets.
          // * key: [arrayType, num] - name is an Array of TypedArrays of num elements
          //   arrayType has to be a typed array. If Array is to contain arrays,
          //   they should be array objects of size num, not num elements from array.

          this.length = 0;
          this.size = 0;
          this.specs = {};
          this.arrayNames = []; // experiment, may not need
          this.defaultNames = [];
          // convert arraySpecs arrays to {Type, elements} objects
          for (var key in arraySpecs) {
            var val = arraySpecs[key];
            if (util.typeOf(val) === 'function') val = [val, 1];
            var _val = val;

            var _val2 = _slicedToArray(_val, 2);

            var Type = _val2[0];
            var elements = _val2[1];

            this.specs[key] = { Type: Type, elements: elements };

            if (elements === 0) // experiment, may not need
              this.defaultNames.push(key);else this.arrayNames.push(key);
          }
          this.initSize = initSize;
          this.deltaSize = deltaSize;
          this.arrays = {};
          this.initArrays(this.specs);
          this.sharedGetterSetter = this.createGetterSetter();
        }

        _createClass(OofA, [{
          key: 'initArrays',
          value: function initArrays(specs) {
            var arrays = this.arrays;
            for (var key in specs) {
              var val = specs[key];
              var Type = val.Type;
              var elements = val.elements;
              // type caps: a ctor

              if (Type === Array && elements > 1) util.error('OofA: JavaScript Arrays must have "elements" 0 or 1');

              if (elements === 0) arrays[key] = Type;else if (Type === Array || elements === 1) arrays[key] = new Type(0);else {
                arrays[key] = [];arrays[key].typedArray = new Type(0);
              }
            }
            this.extendArrays(this.initSize);
          }
        }, {
          key: 'extendArrayOfTypedArrays',
          value: function extendArrayOfTypedArrays(array, elements, deltaSize) {
            array.typedArray = this.extendTypedArray(array.typedArray, deltaSize * elements);
            for (var i = array.length, len = i + deltaSize; i < len; i++) {
              var start = i * elements;
              var end = start + elements;
              array[i] = array.typedArray.subarray(start, end);
            }
            // No return needed, array is mutated instead.
          }
        }, {
          key: 'extendTypedArray',
          value: function extendTypedArray(array, deltaSize) {
            var ta = new array.constructor(array.length + deltaSize); // make new array
            ta.set(array); // fill it with old array
            return ta;
          }
        }, {
          key: 'extendArrays',
          value: function extendArrays(deltaSize) {
            if (deltaSize === 0) util.error('OofA: attempting to extend static arrays');
            for (var key in this.arrays) {
              var _specs$key = this.specs[key];
              var Type = _specs$key.Type;
              var elements = _specs$key.elements;

              if (elements === 0) continue; // a 'default', a single element
              var array = this.arrays[key];
              if (Type === Array) array.fill(null, this.size, this.size + deltaSize);else if (elements === 1) this.arrays[key] = this.extendTypedArray(array, deltaSize);else this.extendArrayOfTypedArrays(array, elements, deltaSize);
            }
            this.size += deltaSize;
          }
        }, {
          key: 'getValueAt',
          value: function getValueAt(ix, key) {
            var elements = this.specs[key].elements;

            var array = this.arrays[key];
            if (elements === 0) return array;
            return array[ix];
          }
        }, {
          key: 'setValueAt',
          value: function setValueAt(ix, key, val) {
            var elements = this.specs[key].elements;

            var array = this.arrays[key];
            if (elements === 0) this.arrays[key] = val; // set default
            else if (elements === 1) array[ix] = val; // set array element
              else array[ix].set(val); // set a subarray (Array of TypedArrays)
          }
        }, {
          key: 'getObject',
          value: function getObject(ix) {
            var obj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            // provide the obj for reuse and reduced gc
            for (var key in this.arrays) {
              obj[key] = this.getValueAt(ix, key);
            }return obj;
          }
        }, {
          key: 'setObject',
          value: function setObject(ix, obj) {
            for (var key in obj) {
              this.setValueAt(ix, key, obj[key]);
            }
          }
        }, {
          key: 'pushObject',
          value: function pushObject(obj) {
            if (this.length === this.size) this.extendArrays(this.deltaSize);
            this.setObject(this.length++, obj);
          }
        }, {
          key: 'forAllObjects',
          value: function forAllObjects(fcn) {
            var obj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            for (var i = 0, len = this.length; i < len; i++) {
              this.getObject(i, obj);
              fcn(obj, i);
            }
          }
        }, {
          key: 'createGetterSetter',
          value: function createGetterSetter() {
            var _this = this;

            var obj = { ix: 0 };
            var arrays = this.arrays;

            var _loop = function _loop(key) {
              var elements = _this.specs[key].elements;

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
                  return arrays[key][obj.ix];
                },
                set: function set(val) {
                  return arrays[key][obj.ix].set(val, 0, elements);
                }
              });
            };

            for (var key in arrays) {
              _loop(key);
            }
            return obj;
          }
        }, {
          key: 'getterSetterAt',
          value: function getterSetterAt(ix) {
            var getterSetter = arguments.length <= 1 || arguments[1] === undefined ? this.sharedGetterSetter : arguments[1];

            // Could extend via: this.extendArrays(this.deltaSize)
            if (ix >= this.length) util.error('getterSetter: index beyond length');
            getterSetter.ix = ix;
            return getterSetter;
          }
        }, {
          key: 'push',
          value: function push(obj) {
            var getterSetter = arguments.length <= 1 || arguments[1] === undefined ? this.sharedGetterSetter : arguments[1];

            if (this.length === this.size) this.extendArrays(this.deltaSize);
            var ix = this.length++;
            getterSetter.ix = ix;
            for (var key in obj) {
              getterSetter[key] = obj[key];
            }
          }
        }, {
          key: 'forAll',
          value: function forAll(fcn) {
            var getterSetter = arguments.length <= 1 || arguments[1] === undefined ? this.sharedGetterSetter : arguments[1];

            for (var i = 0, len = this.length; i < len; i++) {
              getterSetter.ix = i;
              fcn(getterSetter, i);
            }
          }
        }]);

        return OofA;
      }();

      _export('default', OofA);
    }
  };
});