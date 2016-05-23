'use strict';

System.register(['./util.js'], function (_export, _context) {
  var u, _slicedToArray, _createClass, DataSet;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_utilJs) {
      u = _utilJs.default;
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

      DataSet = function () {
        _createClass(DataSet, null, [{
          key: 'emptyDataSet',
          value: function emptyDataSet(width, height, Type) {
            return new DataSet(width, height, new Type(width * height));
          }
        }]);

        // The **DataSet Class** constructor and methods

        // constructor: Stores the three DataSet components.
        // Checks data is right size, throws an error if not.

        function DataSet(width, height, data) {
          _classCallCheck(this, DataSet);

          if (data.length !== width * height) u.error('new DataSet length: ' + data.length + ' !== ' + width + ' * ' + height);else {
            ;
            var _ref = [width, height, data];
            this.width = _ref[0];
            this.height = _ref[1];
            this.data = _ref[2];
          }
        }

        // Checks x,y are within DataSet. Throw error if not.


        _createClass(DataSet, [{
          key: 'checkXY',
          value: function checkXY(x, y) {
            if (!(u.between(x, 0, this.width - 1) && u.between(y, 0, this.height - 1))) u.error('DataSet.checkXY: x,y out of range: ' + x + ', ' + y);
          }
        }, {
          key: 'type',
          value: function type() {
            return this.data.constructor;
          }
        }, {
          key: 'toIndex',
          value: function toIndex(x, y) {
            return x + y * this.width;
          }
        }, {
          key: 'toXY',
          value: function toXY(i) {
            return [i % this.width, Math.floor(i / this.width)];
          }
        }, {
          key: 'getXY',
          value: function getXY(x, y) {
            return this.data[this.toIndex(x, y)];
          }
        }, {
          key: 'setXY',
          value: function setXY(x, y, num) {
            this.data[this.toIndex(x, y)] = num;
          }
        }, {
          key: 'sample',
          value: function sample(x, y) {
            var useNearest = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            return useNearest ? this.nearest(x, y) : this.bilinear(x, y);
          }
        }, {
          key: 'nearest',
          value: function nearest(x, y) {
            this.checkXY(Math.round(x), Math.round(y));
            return this.getXY(Math.round(x), Math.round(y));
          }
        }, {
          key: 'bilinear',
          value: function bilinear(x, y) {
            // Billinear sampling works by making two linear interpolations (lerps)
            // in the x direction, and a third in the y direction, between the
            // two x results. See wikipedia:
            // [bilinear sampling](http://en.wikipedia.org/wiki/Bilinear_interpolation)
            // The diagram shows the three lerps
            this.checkXY(x, y);
            var x0 = Math.floor(x);
            var y0 = Math.floor(y);

            var i = this.toIndex(x0, y0);
            var w = this.width;
            var dx = x - x0;
            var dy = y - y0;
            var dx1 = 1 - dx;
            var dy1 = 1 - dy;
            // dx1, dy1 = 1 if x, y on boundary
            var f00 = this.data[i];
            // Edge case: fij is 0 if beyond data array; undefined -> 0.
            // This cancels the given component's factor in the result.
            var f10 = this.data[i + 1] || 0; // 0 at bottom right corner
            var f01 = this.data[i + w] || 0; // 0 at all bottom row
            var f11 = this.data[i + 1 + w] || 0; // 0 at end of next to bottom row
            // This is a bit involved but:
            // ```
            // If dx = 0; dx1 = 1, dy != 0
            // -> vertical linear interpolation
            // fxy = f00(1-dy) + f01(dy) i.e. y-lerp
            //
            // If dx != 0; dy = 0, dx !=0
            // -> horizontal linear interpolation
            // fxy = f00(1-dx) + f10(dx) i.e. x-lerp
            // ```
            return f00 * dx1 * dy1 + f10 * dx * dy1 + f01 * dx1 * dy + f11 * dx * dy;
          }
        }, {
          key: 'copy',
          value: function copy() {
            return new DataSet(this.width, this.height, u.copyArray(this.data));
          }
        }, {
          key: 'emptyDataSet',
          value: function emptyDataSet(width, height) {
            return DataSet.emptyDataSet(width, height, this.type()); // see statics above
          }
        }, {
          key: 'emptyArray',
          value: function emptyArray(length) {
            var Type = this.type();
            return new Type(length);
          }
        }, {
          key: 'resample',
          value: function resample(width, height) {
            var useNearest = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
            var Type = arguments.length <= 3 || arguments[3] === undefined ? Array : arguments[3];

            if (width === this.width && height === this.height) return this.copy();
            var ds = DataSet.emptyDataSet(width, height, Type);
            var xScale = (this.width - 1) / (width - 1);
            var yScale = (this.height - 1) / (height - 1);
            for (var y = 0; y < height; y++) {
              for (var x = 0; x < width; x++) {
                ds.setXY(x, y, this.sample(x * xScale, y * yScale, useNearest));
              }
            }return ds;
          }
        }, {
          key: 'subset',
          value: function subset(x, y, width, height) {
            if (x + width > this.width || y + height > this.height) u.error('DataSet.subSet: params out of range');
            var ds = this.emptyDataSet(width, height);
            for (var i = 0; i < width; i++) {
              for (var j = 0; j < height; j++) {
                ds.setXY(i, j, this.getXY(i + x, j + y));
              }
            }return ds;
          }
        }, {
          key: 'map',
          value: function map(f) {
            return new DataSet(this.width, this.height, this.data.map(f));
          }
        }, {
          key: 'col',
          value: function col(x) {
            var w = this.width;
            var h = this.height;
            var data = this.data;

            if (x >= w) u.error('col: x out of range width: ' + w + ' x: ' + x);
            var colData = this.emptyArray(h);
            for (var i = 0; i < h; i++) {
              colData[i] = data[x + i * w];
            }return colData;
          }
        }, {
          key: 'row',
          value: function row(y) {
            var w = this.width;
            var h = this.height;

            if (y >= h) u.error('row: y out of range height: ' + h + ' x: ' + y);
            return this.data.slice(y * w, (y + 1) * w);
          }
        }, {
          key: 'toThisType',
          value: function toThisType(array) {
            var type = this.type();
            if (array.constructor === type) return array;
            return u.convertArray(array, type);
          }
        }, {
          key: 'convertType',
          value: function convertType(type) {
            if (this.type() === type) return;
            this.data = u.convertArray(this.data, type);
          }
        }, {
          key: 'concatEast',
          value: function concatEast(ds) {
            var w = this.width;
            var h = this.height;
            var w1 = ds.width;
            var h1 = ds.height;

            if (h !== h1) u.error('concatEast: heights not equal ' + h + ', ' + h1);
            var ds1 = this.emptyDataSet(w + w1, h);
            for (var x = 0; x < h; x++) {
              // copy this into new dataset
              for (var y = 0; y < w; y++) {
                ds1.setXY(x, y, this.getXY(x, y));
              }
            }for (var _x4 = 0; _x4 < h1; _x4++) {
              // copy ds to the left side
              for (var _y = 0; _y < w1; _y++) {
                ds1.setXY(_x4 + w, _y, ds.getXY(_x4, _y));
              }
            }return ds1;
          }
        }, {
          key: 'concatSouth',
          value: function concatSouth(dataset) {
            var w = this.width;
            var h = this.height;
            var data = this.data;

            if (w !== dataset.width) u.error('concatSouth: widths not equal ' + w + ', ' + dataset.width);
            var data1 = u.concatArrays(data, dataset.data);
            return new DataSet(w, h + dataset.height, data1);
          }
        }, {
          key: 'transformCoords',
          value: function transformCoords(x, y, tlx, tly, w, h) {
            var xs = (x - tlx) * (this.width - 1) / w;
            var ys = (tly - y) * (this.height - 1) / h;
            return [xs, ys];
          }
        }, {
          key: 'coordSample',
          value: function coordSample(x, y, tlx, tly, w, h) {
            var useNearest = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];

            var _transformCoords = this.transformCoords(x, y, tlx, tly, w, h);

            var _transformCoords2 = _slicedToArray(_transformCoords, 2);

            var xs = _transformCoords2[0];
            var ys = _transformCoords2[1];

            return this.sample(xs, ys, useNearest);
          }
        }, {
          key: 'neighborhood',
          value: function neighborhood(x, y) {
            var array = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

            array.length = 0; // in case user supplied an array
            for (var dy = -1; dy <= +1; dy++) {
              for (var dx = -1; dx <= +1; dx++) {
                var x0 = u.clamp(x + dx, 0, this.width - 1);
                var y0 = u.clamp(y + dy, 0, this.height - 1);
                array.push(this.data[this.toIndex(x0, y0)]);
              }
            }
            return array;
          }
        }, {
          key: 'convolve',
          value: function convolve(kernel) {
            var factor = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
            var crop = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var array = []; // new convolved data
            var n = []; // the current neighborhood

            var _ref2 = crop ? [1, 1, this.height - 1, this.width - 1] : [0, 0, this.height, this.width];

            var _ref3 = _slicedToArray(_ref2, 4);

            var x0 = _ref3[0];
            var y0 = _ref3[1];
            var h = _ref3[2];
            var w = _ref3[3];

            for (var y = y0; y < h; y++) {
              for (var x = x0; x < w; x++) {
                this.neighborhood(x, y, n);
                array.push(u.aSum(u.aPairMul(kernel, n)) * factor);
              }
            }
            return new DataSet(w - x0, h - y0, array);
          }
        }, {
          key: 'dzdx',
          value: function dzdx() {
            var n = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];
            var factor = arguments.length <= 1 || arguments[1] === undefined ? 1 / 8 : arguments[1];

            return this.convolve([-1, 0, 1, -n, 0, n, -1, 0, 1], factor);
          }
        }, {
          key: 'dzdy',
          value: function dzdy() {
            var n = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];
            var factor = arguments.length <= 1 || arguments[1] === undefined ? 1 / 8 : arguments[1];

            return this.convolve([1, n, 1, 0, 0, 0, -1, -n, -1], factor);
          }
        }, {
          key: 'laplace8',
          value: function laplace8() {
            return this.convolve([-1, -1, -1, -1, 8, -1, -1, -1, -1]);
          }
        }, {
          key: 'laplace4',
          value: function laplace4() {
            return this.convolve([0, -1, 0, -1, 4, -1, 0, -1, 0]);
          }
        }, {
          key: 'blur',
          value: function blur() {
            var factor = arguments.length <= 0 || arguments[0] === undefined ? 0.0625 : arguments[0];
            // 1/16 = 0.0625
            return this.convolve([1, 2, 1, 2, 4, 2, 1, 2, 1], factor);
          }
        }, {
          key: 'edge',
          value: function edge() {
            return this.convolve([1, 1, 1, 1, -7, 1, 1, 1, 1]);
          }
        }, {
          key: 'slopeAndAspect',
          value: function slopeAndAspect() {
            var cellSize = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
            var noNaNs = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
            var posAngle = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            var dzdx = this.dzdx(); // sub left z from right
            var dzdy = this.dzdy(); // sub bottom z from top
            var aspect = [];
            var slope = [];
            var h = dzdx.height;
            var w = dzdx.width;

            for (var y = 0; y < h; y++) {
              for (var x = 0; x < w; x++) {
                var gx = dzdx.getXY(x, y);
                var gy = dzdy.getXY(x, y);

                slope.push(Math.atan(u.distance(gx, gy)) / cellSize); // radians
                if (noNaNs) while (gx === gy) {
                  gx += u.randomNormal(0, 0.0001);gy += u.randomNormal(0, 0.0001);
                }
                // radians in [-PI,PI], downhill
                var rad = gx === gy && gy === 0 ? NaN : Math.atan2(-gy, -gx);
                // positive radians in [0,2PI] if desired
                if (posAngle && rad < 0) rad += 2 * Math.PI;
                aspect.push(rad);
              }
            }
            slope = new DataSet(w, h, slope);
            aspect = new DataSet(w, h, aspect);
            return { slope: slope, aspect: aspect, dzdx: dzdx, dzdy: dzdy };
          }
        }, {
          key: 'toContext',
          value: function toContext() {
            var normalize = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
            var gray = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var alpha = arguments.length <= 2 || arguments[2] === undefined ? 255 : arguments[2];
            var w = this.width;
            var h = this.height;
            var data = this.data;

            var idata = void 0;
            if (normalize) {
              idata = gray ? u.normalize8(data) : u.normalizeInt(data, 0, Math.pow(2, 24) - 1);
            } else {
              idata = data.map(function (a) {
                return Math.round(a);
              });
            }
            var ctx = u.createCtx(w, h);
            var id = ctx.getImageData(0, 0, w, h);
            var ta = id.data; // ta short for typed array
            for (var i = 0; i < idata.length; i++) {
              var num = idata[i];
              var j = 4 * i;
              // j = byte index into ta
              if (gray) {
                ta[j] = ta[j + 1] = ta[j + 2] = Math.floor(num);ta[j + 3] = alpha;
              } else {
                ta[j] = num >> 16 & 0xff;
                ta[j + 1] = num >> 8 & 0xff;
                ta[j + 2] = num & 0xff;
                ta[j + 3] = alpha; // if not 255, image will be premultiplied.
              }
            }
            ctx.putImageData(id, 0, 0);
            return ctx;
          }
        }, {
          key: 'toCanvas',
          value: function toCanvas() {
            var normalize = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
            var gray = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var alpha = arguments.length <= 2 || arguments[2] === undefined ? 255 : arguments[2];

            return this.toContext(gray, normalize, alpha).canvas;
          }
        }, {
          key: 'toDataUrl',
          value: function toDataUrl() {
            var normalize = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
            var gray = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var alpha = arguments.length <= 2 || arguments[2] === undefined ? 255 : arguments[2];

            return u.ctxToDataUrl(this.toContext(gray, normalize, alpha));
          }
        }]);

        return DataSet;
      }();

      _export('default', DataSet);
    }
  };
});