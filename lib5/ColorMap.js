'use strict';

System.register(['./util.js', './Color.js'], function (_export, _context) {
  var util, Color, ColorMap;

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
    }, function (_ColorJs) {
      Color = _ColorJs.default;
    }],
    execute: function () {
      ColorMap = {
        gradientImageData: function gradientImageData(nColors, stops, locs) {
          // Convert the color stops to css strings
          stops = stops.map(function (c) {
            return Array.isArray(c) ? Color.rgbaString.apply(Color, _toConsumableArray(c)) : c;
          });
          var ctx = util.createCtx(nColors, 1);
          // Install default locs if none provide
          if (!locs) locs = util.aRamp(0, 1, stops.length);
          // create a new gradient and fill it with the color stops
          var grad = ctx.createLinearGradient(0, 0, nColors, 0);
          util.repeat(stops.length, function (i) {
            return grad.addColorStop(locs[i], stops[i]);
          });
          // draw the gradient returning the image data TypedArray
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, nColors, 1);
          return util.ctxToImageData(ctx).data;
        },
        typedArrayToTypedColors: function typedArrayToTypedColors(typedArray) {
          var array = [];
          util.step(typedArray.length, 4, function (i) {
            return array.push(Color.typedColor(typedArray.subarray(i, i + 4)));
          });
          array.typedArray = typedArray;
          return array;
        },
        arrayToColors: function arrayToColors(array) {
          var typedArray = new Uint8ClampedArray(array.length * 4);
          util.repeat(array.length, function (i) {
            var a = array[i];
            if (a.length === 3) a.push(255);
            typedArray.set(a, i * 4);
          });
          return this.typedArrayToTypedColors(typedArray);
        },
        permuteArrays: function permuteArrays(A1) {
          var A2 = arguments.length <= 1 || arguments[1] === undefined ? A1 : arguments[1];
          var A3 = arguments.length <= 2 || arguments[2] === undefined ? A1 : arguments[2];

          var array = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = A1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var a1 = _step.value;
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = A2[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var a2 = _step2.value;
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = A3[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var a3 = _step3.value;

                      array.push([a1, a2, a3]);
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
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

          return array;
        },
        permuteRGBColors: function permuteRGBColors(numRs) {
          var numGs = arguments.length <= 1 || arguments[1] === undefined ? numRs : arguments[1];
          var numBs = arguments.length <= 2 || arguments[2] === undefined ? numRs : arguments[2];

          var toRamp = function toRamp(num) {
            return util.aIntRamp(0, 256, num);
          };
          var ramps = [numRs, numGs, numBs].map(toRamp);
          return this.permuteArrays.apply(this, _toConsumableArray(ramps));
        },


        // ### ColorMaps

        // ColorMaps are Arrays of TypedColors with these methods.
        // Webgl ready if made with typedArrayToTypedColors or arrayToColors above.
        ColorMapProto: {
          __proto__: Array.prototype,
          createIndex: function createIndex() {
            var _this = this;

            this.index = [];
            util.repeat(this.length, function (i) {
              var px = _this[i].getPixel();
              _this.index[px] = i;
            });
          },
          randomIndex: function randomIndex() {
            return util.randomInt(this.length);
          },
          randomColor: function randomColor() {
            return this[this.randomIndex()];
          },
          lookup: function lookup(color) {
            if (this.index) return this.index[color.getPixel()];
            for (var i = 0; i < this.length; i++) {
              if (color.equals(this[i])) return i;
            }return undefined;
          },
          scaleColor: function scaleColor(number, min, max) {
            // number = util.clamp(number, min, max)
            var scale = util.lerpScale(number, min, max);
            var index = Math.round(util.lerp(0, this.length - 1, scale));
            return this[index];
          },
          webglArray: function webglArray() {
            return this.typedArray;
          }
        },
        basicColorMap: function basicColorMap(array) {
          array = this.arrayToColors(array);
          util.setPrototypeOf(array, this.ColorMapProto);
          return array;
        }
      };

      _export('default', ColorMap);
    }
  };
});
//# sourceMappingURL=ColorMap.js.map