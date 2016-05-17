'use strict';

System.register([], function (_export, _context) {
  var util;
  return {
    setters: [],
    execute: function () {
      util = {

        // ### Types ###

        // Fixing the javascript [typeof operator](https://goo.gl/Efdzk5)
        typeOf: function typeOf(obj) {
          return {}.toString.call(obj).match(/\s(\w+)/)[1].toLowerCase();
        },
        // Is obj Array or Object (but not typed array)?
        isAorO: function isAorO(obj) {
          return ['array', 'object'].indexOf(util.typeOf(obj)) >= 0;
        },
        // Is obj TypedArray? If obj.buffer not present, works, type is 'undefined'
        isTypedArray: function isTypedArray(obj) {
          return util.typeOf(obj.buffer) === 'arraybuffer';
        },
        // Is a number an integer (rather than a float w/ non-zero fractional part)
        isInteger: Number.isInteger || function (num) {
          return Math.floor(num) === num;
        },
        isLittleEndian: function isLittleEndian() {
          var d32 = new Uint32Array([0x01020304]);
          return new Uint8ClampedArray(d32.buffer)[0] === 4;
        },


        // Throw an error with string.
        // Use instead of `throw message` for better debugging
        error: function error(message) {
          throw new Error(message);
        },

        // Return identity fcn, returning its argument unchanged. Used in callbacks
        identity: function identity(o) {
          return o;
        },
        // Return function returning an object's property.  Property in fcn closure.
        propFcn: function propFcn(prop) {
          return function (o) {
            return o[prop];
          };
        },

        convertArray: function convertArray(array, Type) {
          var Type0 = array.constructor;
          if (Type0 === Type) return array; // return array if already same Type
          if (Type !== Array) return new Type(array); // TypedArray: universal ctor
          return Array.prototype.slice.call(array); // Convert TypedArray to Array
        },
        timeit: function timeit(f) {
          var runs = arguments.length <= 1 || arguments[1] === undefined ? 1e5 : arguments[1];
          var name = arguments.length <= 2 || arguments[2] === undefined ? 'test' : arguments[2];

          console.time(name); // eslint-disable-line
          for (var i = 0; i < runs; i++) {
            f(i);
          }console.timeEnd(name); // eslint-disable-line
        },
        pps: function pps(obj) {
          var title = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

          if (title) console.log(title); // eslint-disable-line
          var count = 1;
          var str = '';
          while (obj) {
            if (typeof obj === 'function') {
              str = obj.constructor.toString();
            } else {
              var okeys = Object.keys(obj);
              str = okeys.length > 0 ? '[' + okeys.join(', ') + ']' : '[' + obj.constructor.name + ']';
            }
            console.log('[' + count++ + ']: ' + str); // eslint-disable-line
            obj = Object.getPrototypeOf(obj);
          }
        },
        arraysToString: function arraysToString(arrays) {
          var str = '';
          this.repeat(arrays.length, function (i) {
            str += '[' + arrays[i] + ']';
          });
          return str;
        },
        parseQueryString: function parseQueryString() {
          var results = {};
          var query = document.location.search.substring(1);
          query.split('&').forEach(function (s) {
            var param = s.split('=');
            results[param[0]] = param.length === 1 ? true : param[1];
          });
          return results;
        },
        setScript: function setScript(path) {
          var scriptTag = document.createElement('script');
          scriptTag.src = path;
          document.querySelector('head').appendChild(scriptTag);
        },


        // ### Math ###

        // Return random int/float in [0,max) or [min,max) or [-r/2,r/2)
        randomInt: function randomInt(max) {
          return Math.floor(Math.random() * max);
        },
        randomInt2: function randomInt2(min, max) {
          return min + Math.floor(Math.random() * (max - min));
        },
        randomFloat: function randomFloat(max) {
          return Math.random() * max;
        },
        randomFloat2: function randomFloat2(min, max) {
          return min + Math.random() * (max - min);
        },
        randomCentered: function randomCentered(r) {
          return util.randomFloat2(-r / 2, r / 2);
        },

        randomNormal: function randomNormal() {
          var mean = arguments.length <= 0 || arguments[0] === undefined ? 0.0 : arguments[0];
          var sigma = arguments.length <= 1 || arguments[1] === undefined ? 1.0 : arguments[1];
          var u1 = 1.0 - Math.random();
          var u2 = Math.random();
          // ui in 0,1
          var norm = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          return norm * sigma + mean;
        },


        // Return whether num is [Power of Two](http://goo.gl/tCfg5). Very clever!
        isPowerOf2: function isPowerOf2(num) {
          return (num & num - 1) === 0;
        }, // twgl library

        // Degrees & Radians
        radians: function radians(degrees) {
          return degrees * Math.PI / 180;
        },
        degrees: function degrees(radians) {
          return radians * 180 / Math.PI;
        },

        // Hypotenuse/distance from origin of point x,y
        distance: function distance(x, y) {
          return Math.sqrt(x * x + y * y);
        },

        fixed: function fixed(n) {
          var digits = arguments.length <= 1 || arguments[1] === undefined ? 4 : arguments[1];

          var p = Math.pow(10, digits);
          return Math.round(n * p) / p;
        },
        clamp: function clamp(v, min, max) {
          if (v < min) return min;
          if (v > max) return max;
          return v;
        },


        // Return true is val in [min, max] enclusive
        between: function between(val, min, max) {
          return min <= val && val <= max;
        },

        // Return a linear interpolation between lo and hi.
        // Scale is in [0-1], a percentage, and the result is in [lo,hi]
        // If lo>hi, scaling is from hi end of range.
        // [Why the name `lerp`?](http://goo.gl/QrzMc)
        lerp: function lerp(lo, hi, scale) {
          return lo <= hi ? lo + (hi - lo) * scale : lo - (lo - hi) * scale;
        },
        // Calculate the lerp scale given lo/hi pair and a number between them.
        lerpScale: function lerpScale(number, lo, hi) {
          return (number - lo) / (hi - lo);
        },

        setPrototypeOf: function setPrototypeOf(obj, prototype) {
          if (Object.setPrototypeOf) Object.setPrototypeOf(obj, prototype);else obj.__proto__ = prototype; // eslint-disable-line
          return obj;
        },
        forAll: function forAll(arrayOrObj, fcn) {
          if (arrayOrObj.slice) // typed & std arrays
            for (var i = 0, len = arrayOrObj.length; i < len; i++) {
              fcn(arrayOrObj[i], i, arrayOrObj);
            } else Object.keys(arrayOrObj).forEach(function (k) {
            return fcn(arrayOrObj[k], k, arrayOrObj);
          });
          return arrayOrObj;
        },
        repeat: function repeat(n, f) {
          for (var i = 0; i < n; i++) {
            f(i);
          }
        },
        step: function step(n, _step, f) {
          for (var i = 0; i < n; i += _step) {
            f(i);
          }
        },
        copyArray: function copyArray(array) {
          if (array.constructor === Array) return array.slice(0);
          return new array.constructor(array);
        },
        concatArrays: function concatArrays(array1, array2) {
          var Type = array1.constructor;
          if (Type === Array) return array1.concat(this.convertArray(array2, Array));
          var array = new Type(array1.length + array2.length);
          // Note typedArray.set() allows any Array or TypedArray array.
          array.set(array1);array.set(array2, array1.length);
          return array;
        },
        arrayType: function arrayType(array) {
          return array.constructor;
        },
        fixedArray: function fixedArray(array) {
          var digits = arguments.length <= 1 || arguments[1] === undefined ? 4 : arguments[1];

          // const a = (array.constructor === Array) ?
          //   array : Array.prototype.slice.call(array) // see https://goo.gl/UcIrGZ
          // return a.map(n => util.fixed(n, digits))
          return array.map(function (n) {
            return util.fixed(n, digits);
          });
        },
        clone: function clone(obj) {
          if (obj.slice) return obj.slice(0); // ok for TypedArrays
          var result = {};
          Object.keys(obj).forEach(function (k) {
            result[k] = obj[k];
          });
          return result;
        },


        // [Deep clone](http://goo.gl/MIaTxU) an obj or array. Clever!
        deepClone: function deepClone(obj) {
          return JSON.parse(JSON.stringify(obj));
        },

        // Compare Objects or Arrays via JSON string. TypedArrays !== Arrays
        objectsEqual: function objectsEqual(a, b) {
          return JSON.stringify(a) === JSON.stringify(b);
        },

        copyTo: function copyTo(toObj, fromObj) {
          Object.keys(fromObj).forEach(function (k) {
            toObj[k] = fromObj[k];
          });
        },
        uniq: function uniq(array) {
          var f = function f(ai, i, a) {
            return ai !== a[i - 1];
          }; // a[-1] ok, is undefined, no error
          return array.filter(f);
        },
        randomArray: function randomArray(length) {
          var min = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
          var max = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
          var Type = arguments.length <= 3 || arguments[3] === undefined ? Array : arguments[3];

          var a = new Type(length);
          for (var i = 0; i < length; i++) {
            a[i] = this.randomFloat2(min, max);
          }
          return a;
        },


        // Create an array of properties from an array of objects
        propArray: function propArray(array, propName) {
          return array.map(function (a) {
            return a[propName];
          });
        },

        histogram: function histogram(array) {
          var bin = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
          var min = arguments.length <= 2 || arguments[2] === undefined ? Math.floor(this.aMin(array)) : arguments[2];

          var hist = [];
          var minBin = Number.MAX_VALUE;
          var maxBin = Number.MIN_VALUE;
          var minVal = Number.MAX_VALUE;
          var maxVal = Number.MIN_VALUE;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion = (_step2 = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var a = _step2.value;

              var _i = Math.floor(a / bin) - min;
              hist[_i] = hist[_i] === undefined ? 1 : hist[_i] + 1;
              minBin = Math.min(minBin, _i);
              maxBin = Math.max(maxBin, _i);
              minVal = Math.min(minVal, a);
              maxVal = Math.max(maxVal, a);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          for (var i in hist) {
            if (hist[i] === undefined) {
              hist[i] = 0;
            }
          }var bins = maxBin - minBin + 1;
          return { bins: bins, minBin: minBin, maxBin: maxBin, minVal: minVal, maxVal: maxVal, hist: hist };
        },


        // Return scalar max/min/sum/avg of numeric array.
        // Works with es6 TypedArrays
        aMax: function aMax(array) {
          return array.reduce(function (a, b) {
            return Math.max(a, b);
          });
        },
        aMin: function aMin(array) {
          return array.reduce(function (a, b) {
            return Math.min(a, b);
          });
        },
        aSum: function aSum(array) {
          return array.reduce(function (a, b) {
            return a + b;
          });
        },
        aAvg: function aAvg(array) {
          return util.aSum(array) / array.length;
        },

        sortNums: function sortNums(array) {
          var ascending = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

          return array.sort(function (a, b) {
            return ascending ? a - b : b - a;
          });
        },
        sortObjs: function sortObjs(array, fcn) {
          var ascending = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

          if (typeof fcn === 'string') fcn = this.propFcn(fcn);
          var comp = function comp(a, b) {
            if (fcn(a) > fcn(b)) return 1;
            if (fcn(a) < fcn(b)) return -1;
            return 0;
          };
          return array.sort(function (a, b) {
            return ascending ? comp(a, b) : -comp(a, b);
          });
        },
        shuffle: function shuffle(array) {
          array.sort(function (a, b) {
            return Math.random() < 0.5;
          });return array;
        },


        // Return array composed of f(a1i, a2i) called pairwise on both arrays
        aPairwise: function aPairwise(a1, a2, f) {
          return a1.map(function (val, i) {
            return f(val, a2[i]);
          });
        },
        aPairSum: function aPairSum(a1, a2) {
          return util.aPairwise(a1, a2, function (a, b) {
            return a + b;
          });
        },
        aPairDif: function aPairDif(a1, a2) {
          return util.aPairwise(a1, a2, function (a, b) {
            return a - b;
          });
        },
        aPairMul: function aPairMul(a1, a2) {
          return util.aPairwise(a1, a2, function (a, b) {
            return a * b;
          });
        },
        aPairEq: function aPairEq(a1, a2) {
          return util.aPairDif(a1, a2).every(function (a) {
            return a === 0;
          });
        },

        aRamp: function aRamp(start, stop, numItems) {
          // Note: start + step*i, where step is (stop-start)/(numItems-1),
          // has float accuracy problems, must recalc step each iteration.
          if (numItems <= 1) this.error('aRamp: numItems must be > 1');
          var a = [];
          for (var i = 0; i < numItems; i++) {
            a.push(start + (stop - start) * (i / (numItems - 1)));
          }return a;
        },
        aIntRamp: function aIntRamp(start, stop) {
          var numItems = arguments.length <= 2 || arguments[2] === undefined ? Math.abs(stop - start) + 1 : arguments[2];

          return this.aRamp(start, stop, numItems).map(function (a) {
            return Math.round(a);
          });
        },
        normalize: function normalize(array) {
          var _this = this;

          var lo = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
          var hi = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
          var min = this.aMin(array);
          var max = this.aMax(array);

          var scale = 1 / (max - min);
          return array.map(function (n) {
            return _this.lerp(lo, hi, scale * (n - min));
          });
        },
        normalize8: function normalize8(array) {
          return new Uint8ClampedArray(this.normalize(array, -0.5, 255.5));
        },
        normalizeInt: function normalizeInt(array, lo, hi) {
          return this.normalize(array, lo, hi).map(function (n) {
            return Math.round(n);
          });
        },
        imagePromise: function imagePromise(url) {
          return new Promise(function (resolve, reject) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
              return resolve(img);
            };
            img.onerror = function () {
              return reject('Could not load image ' + url);
            };
            img.src = url;
          });
        },
        xhrPromise: function xhrPromise(url) {
          var type = arguments.length <= 1 || arguments[1] === undefined ? 'text' : arguments[1];
          var method = arguments.length <= 2 || arguments[2] === undefined ? 'GET' : arguments[2];

          return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url); // POST mainly for security and large files
            xhr.responseType = type;
            xhr.onload = function () {
              return resolve(xhr.response);
            };
            xhr.onerror = function () {
              return reject(xhr.responseText);
            };
            xhr.send();
          });
        },
        runGenerator: function runGenerator(g) {
          var it = g();(function iterate(val) {
            // asynchronously iterate over generator
            var ret = it.next(val);
            if (!ret.done) {
              ret.value.then(iterate); // wait on the promise
            }
          })();
        },

        // Used like this, main() is entirely sync:
        // ```
        // function* main() {
        //   var path = 'http://s3.amazonaws.com/backspaces/'
        //   var val1 = yield util.xhrPromise(path + 'lorem1.txt')
        //   console.log( 'val1', val1 )
        //   var val2 = yield util.xhrPromise(path + 'lorem2.txt')
        //   console.log( 'val2', val2 )
        // }
        // util.runGenerator( main )
        // ```

        // ### Canvas/Image ###

        // Get an image in this page by its ID
        getCanvasByID: function getCanvasByID(id) {
          return document.getElementById(id);
        },
        createCanvas: function createCanvas(width, height) {
          var can = document.createElement('canvas');
          can.width = width;can.height = height;
          return can;
        },
        createCtx: function createCtx(width, height) {
          var ctxType = arguments.length <= 2 || arguments[2] === undefined ? '2d' : arguments[2];

          var can = this.createCanvas(width, height);
          return can.getContext(ctxType === '2d' ? '2d' : 'webgl');
        },
        ctxToImageData: function ctxToImageData(ctx) {
          return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        },

        // Return an image/png base64 [dataUrl](https://goo.gl/fyBPnL)
        // string for this ctx object.
        ctxToDataUrl: function ctxToDataUrl(ctx) {
          return ctx.canvas.toDataURL('image/png');
        },

        dataUrlToImage: function dataUrlToImage(dataUrl) {
          // async in some browsers?? http://goo.gl/kIk2U
          var img = new Image();
          img.src = dataUrl;
          return img;
        },
        dataUrlToCtx: function dataUrlToCtx(dataUrl) {
          // async in some browsers?? http://goo.gl/kIk2U
          var img = this.dataUrlToImage(dataUrl);
          var ctx = this.createCtx(img.width, img.height);
          ctx.drawImage(img, 0, 0);
          return ctx;
        },
        getEventXY: function getEventXY(element, evt) {
          // http://goo.gl/356S91
          var rect = element.getBoundingClientRect();
          return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
        },
        imageToCtx: function imageToCtx(img) {
          var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
          var y = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
          var width = arguments.length <= 3 || arguments[3] === undefined ? img.width : arguments[3];
          var height = arguments.length <= 4 || arguments[4] === undefined ? img.height : arguments[4];

          if (x + width > img.width || y + height > img.height) this.error('imageToCtx: parameters outside of image');
          var ctx = this.createCtx(width, height);
          ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
          return ctx;
        }
      };

      _export('default', util);
    }
  };
});
//# sourceMappingURL=util.js.map