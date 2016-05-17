'use strict';

System.register(['./util.js'], function (_export, _context) {
  var util, _slicedToArray, Color, TypedColorProto;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
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

      Color = {
        rgbaString: function rgbaString(r, g, b) {
          var a = arguments.length <= 3 || arguments[3] === undefined ? 255 : arguments[3];

          a = a / 255;var a4 = a.toPrecision(4);
          return a === 1 ? 'rgb(' + r + ',' + g + ',' + b + ')' : 'rgba(' + r + ',' + g + ',' + b + ',' + a4 + ')';
        },
        hslString: function hslString(h, s, l) {
          var a = arguments.length <= 3 || arguments[3] === undefined ? 255 : arguments[3];

          a = a / 255;var a4 = a.toPrecision(4);
          return a === 1 ? 'hsl(' + h + ',' + s + '%,' + l + '%)' : 'hsla(' + h + ',' + s + '%,' + l + '%,' + a4 + ')';
        },
        hexString: function hexString(r, g, b) {
          var shortOK = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

          if (shortOK) {
            var r0 = r / 17;
            var g0 = g / 17;
            var b0 = b / 17;

            if (util.isInteger(r0) && util.isInteger(g0) && util.isInteger(b0)) return this.hexShortString(r0, g0, b0);
          }
          return '#' + (0x1000000 | (b | g << 8 | r << 16)).toString(16).slice(-6);
        },
        hexShortString: function hexShortString(r, g, b) {
          if (r > 15 || g > 15 || b > 15) {
            util.error('hexShortString: one of ' + [r, g, b] + ' > 15');
          }
          return '#' + r.toString(16) + g.toString(16) + b.toString(16);
        },
        triString: function triString(r, g, b) {
          var a = arguments.length <= 3 || arguments[3] === undefined ? 255 : arguments[3];

          return a === 255 ? // eslint-disable-line
          this.hexString(r, g, b, true) : this.rgbaString(r, g, b, a);
        },


        // ### CSS String Conversions

        // Return 4 element array given any legal CSS string color.
        //
        // Because strings vary widely: CadetBlue, #0f0, rgb(255,0,0),
        // hsl(120,100%,50%), we do not parse strings, instead we let
        // the browser do our work: we set a 1x1 canvas fillStyle
        // to the string and create a pixel, returning the r,g,b,a TypedArray.

        // The shared 1x1 canvas 2D context.
        sharedCtx1x1: util.createCtx(1, 1), stringToUint8s: function stringToUint8s(string) {
          this.sharedCtx1x1.fillStyle = string;
          this.sharedCtx1x1.fillRect(0, 0, 1, 1);
          return this.sharedCtx1x1.getImageData(0, 0, 1, 1).data;
        },
        typedColor: function typedColor(r, g, b) {
          var a = arguments.length <= 3 || arguments[3] === undefined ? 255 : arguments[3];

          var u8array = r.buffer ? r : new Uint8ClampedArray([r, g, b, a]);
          u8array.pixelArray = new Uint32Array(u8array.buffer); // one element array
          // Make this an instance of TypedColorProto
          util.setPrototypeOf(u8array, TypedColorProto);
          return u8array;
        },
        toTypedColor: function toTypedColor(any) {
          if (util.isTypedArray(any) && any.length === 4) return this.typedColor(any);
          var tc = this.typedColor(0, 0, 0, 0);
          if (util.isInteger(any)) tc.setPixel(any);else if (Array.isArray(any) || util.isTypedArray(any)) tc.setColor.apply(tc, _toConsumableArray(any));else if (typeof any === 'string') tc.setString(any);else util.error('toTypedColor: invalid argument');
          return tc;
        },
        randomTypedColor: function randomTypedColor() {
          var r255 = function r255() {
            return util.randomInt(256);
          }; // random int in [0,255]
          return this.typedColor(r255(), r255(), r255());
        }
      };
      TypedColorProto = {
        // Set TypedColorProto prototype to Uint8ClampedArray's prototype
        __proto__: Uint8ClampedArray.prototype,
        setColor: function setColor(r, g, b) {
          var a = arguments.length <= 3 || arguments[3] === undefined ? 255 : arguments[3];

          this.checkColorChange();
          this[0] = r;this[1] = g;this[2] = b;this[3] = a;
        },
        setPixel: function setPixel(pixel) {
          this.checkColorChange();
          this.pixelArray[0] = pixel;
        },
        getPixel: function getPixel() {
          return this.pixelArray[0];
        },
        setString: function setString(string) {
          return this.setColor.apply(this, _toConsumableArray(Color.stringToUint8s(string)));
        },
        getString: function getString() {
          if (this.string == null) this.string = Color.triString.apply(Color, _toConsumableArray(this));
          return this.string;
        },
        checkColorChange: function checkColorChange() {
          // Reset string on color change.
          this.string = null; // will be lazy evaluated via getString.
        },
        equals: function equals(color) {
          return this.getPixel() === color.getPixel();
        },
        rgbDistance: function rgbDistance(r, g, b) {
          var _ref = _slicedToArray(this, 3);

          var r1 = _ref[0];
          var g1 = _ref[1];
          var b1 = _ref[2];

          var rMean = Math.round((r1 + r) / 2);
          var dr = r1 - r;
          var dg = g1 - g;
          var db = b1 - b;
          var dr2 = dr * dr;
          var dg2 = dg * dg;
          var db2 = db * db;

          var distanceSq = ((512 + rMean) * dr2 >> 8) + 4 * dg2 + ((767 - rMean) * db2 >> 8);
          return distanceSq; // Math.sqrt(distanceSq)
        }
      };

      _export('default', Color);
    }
  };
});
//# sourceMappingURL=Color.js.map