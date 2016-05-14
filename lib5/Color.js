'use strict';

System.register(['./util.js'], function (_export, _context) {
  var util, Color, TypedColorProto;

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

          // if (a === 255) { return this.hexString(r, g, b, true) } else { return this.rgbaString(r, g, b, a) }
          return a === 255 ? // eslint-disable-line
          this.hexString(r, g, b, true) : this.rgbaString(r, g, b, a);
        },


        // ### CSS String Conversions

        // Return 4 element array given any legal CSS string color.
        //
        // Legal strings vary widely: CadetBlue, #0f0, rgb(255,0,0), hsl(120,100%,50%)
        //
        // Note: The browser speaks for itself: we simply set a 1x1 canvas fillStyle
        // to the string and create a pixel, returning the r,g,b,a TypedArray.

        // The shared 1x1 canvas 2D context.
        sharedCtx1x1: util.createCtx(1, 1), stringToUint8s: function stringToUint8s(string) {
          this.sharedCtx1x1.fillStyle = string;
          this.sharedCtx1x1.fillRect(0, 0, 1, 1);
          return this.sharedCtx1x1.getImageData(0, 0, 1, 1).data;
        },


        // ### Pixel Colors.

        // Primitive Rgba <-> Pixel manipulation.
        //
        // These use two views onto a 4 byte TypedArray buffer.
        //
        // These shared values are initialized at end of Color,
        // see why at [Stack Overflow](http://goo.gl/qrHXwB)
        sharedPixel: null,
        sharedUint8s: null,

        rgbaToPixel: function rgbaToPixel(r, g, b) {
          var a = arguments.length <= 3 || arguments[3] === undefined ? 255 : arguments[3];

          this.sharedUint8s.set([r, g, b, a]);
          return this.sharedPixel[0];
        },
        pixelToUint8s: function pixelToUint8s(pixel) {
          var sharedOK = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

          this.sharedPixel[0] = pixel;
          return sharedOK ? // eslint-disable-line
          this.sharedUint8s : new Uint8ClampedArray(this.sharedUint8s);
        },
        typedColor: function typedColor(r, g, b) {
          var a = arguments.length <= 3 || arguments[3] === undefined ? 255 : arguments[3];

          var ua = r.buffer ? r : new Uint8ClampedArray([r, g, b, a]);
          ua.pixelArray = new Uint32Array(ua.buffer, ua.byteOffset, 1);
          // Make this an instance of TypedColorProto
          util.setPrototypeOf(ua, TypedColorProto);
          // ua.__proto__ = TypedColorProto
          return ua;
        }
      };

      // initialize sharedPixel and sharedUint8s
      Color.sharedPixel = new Uint32Array(1);
      Color.sharedUint8s = new Uint8ClampedArray(Color.sharedPixel.buffer);

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
        equals: function equals(color) {
          return this.getPixel() === color.getPixel();
        },
        checkColorChange: function checkColorChange() {
          // Check for immutable colormap color.
          if (this.colormap) util.error('typedColor: cannot modify ColorMap color.');
          // Reset string on color change.
          this.string = null; // will be lazy evaluated via getString.
        }
      };

      _export('default', Color);
    }
  };
});
//# sourceMappingURL=Color.js.map