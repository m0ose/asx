import util from './util.js'

const Color = {

// ### CSS Color Strings.

  // CSS colors in HTML are strings, see [Mozillas Color Reference](
  // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value),
  // taking one of 7 forms:
  //
  // * Names: [140 color case-insensitive names](
  //   http://en.wikipedia.org/wiki/Web_colors#HTML_color_names) like
  //   Red, Green, CadetBlue, etc.
  // * Hex, short and long form: #0f0, #ff10a0
  // * RGB: rgb(255, 0, 0), rgba(255, 0, 0, 0.5)
  // * HSL: hsl(120, 100%, 50%), hsla(120, 100%, 50%, 0.8)
  //
  // See [this wikipedia article]
  // (http://en.wikipedia.org/wiki/HSL_and_HSV#Swatches)
  // on differences between HSL and HSB/HSV.

  // Convert 4 r,g,b,a ints in [0-255] to a css color string.
  // Alpha "a" is int in [0-255], not float in 0-1
  rgbaString (r, g, b, a = 255) {
    a = a / 255; let a4 = a.toPrecision(4)
    return (a === 1) ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a4})`
  },

  // Convert 3 ints, h in [0-360], s,l in [0-100]% to a css color string.
  // Alpha "a" is int in [0-255].
  //
  // Note h=0 and h=360 are the same, use h in 0-359 for unique colors.
  hslString (h, s, l, a = 255) {
    a = a / 255; let a4 = a.toPrecision(4)
    return (a === 1) ? `hsl(${h},${s}%,${l}%)` : `hsla(${h},${s}%,${l}%,${a4})`
  },

  // Return a web/html/css hex color string for an r,g,b opaque color (a=255)
  //
  // Both #nnn and #nnnnnn forms supported.
  // Default is to check for the short hex form: #nnn.
  hexString (r, g, b, shortOK = true) {
    if (shortOK) {
      const [r0, g0, b0] = [r / 17, g / 17, b / 17]
      if (util.isInteger(r0) && util.isInteger(g0) && util.isInteger(b0))
        return this.hexShortString(r0, g0, b0)
    }
    return `#${(0x1000000 | (b | g << 8 | r << 16)).toString(16).slice(-6)}`
  },
  // Return the 4 char short version of a hex color.  Each of the r,g,b values
  // must be in [0-15].  The resulting color will be equivalent
  // to `r*17`, `g*17`, `b*17`, resulting in the values:
  //
  //     0, 17, 34, 51, 68, 85, 102, 119, 136, 153, 170, 187, 204, 221, 238, 255
  //
  // This is equivalent util.aRamp(0,255,16), i.e. 16 values per rgb channel.
  hexShortString (r, g, b) {
    if ((r > 15) || (g > 15) || (b > 15)) {
      util.error(`hexShortString: one of ${[r, g, b]} > 15`)
    }
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
  },

  // This is a hybrid string and generally our default.  It returns:
  //
  // * rgbaString if a not 255 (i.e. not opaque)
  // * hexString otherwise
  // * with the hexShortString if appropriate
  triString (r, g, b, a = 255) {
    // if (a === 255) { return this.hexString(r, g, b, true) } else { return this.rgbaString(r, g, b, a) }
    return (a === 255) ? // eslint-disable-line
      this.hexString(r, g, b, true) : this.rgbaString(r, g, b, a)
  },

// ### CSS String Conversions

  // Return 4 element array given any legal CSS string color.
  //
  // Legal strings vary widely: CadetBlue, #0f0, rgb(255,0,0), hsl(120,100%,50%)
  //
  // Note: The browser speaks for itself: we simply set a 1x1 canvas fillStyle
  // to the string and create a pixel, returning the r,g,b,a TypedArray.

  // The shared 1x1 canvas 2D context.
  sharedCtx1x1: util.createCtx(1, 1), // share across calls.
  // Convert any css string to TypedArray.
  // If you need a JavaScript Array, use util.convertArray(array, Array)
  stringToUint8s (string) {
    this.sharedCtx1x1.fillStyle = string
    this.sharedCtx1x1.fillRect(0, 0, 1, 1)
    return this.sharedCtx1x1.getImageData(0, 0, 1, 1).data
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

  // Convert r,g,b,a to a single Uint32 pixel, correct endian format.
  rgbaToPixel (r, g, b, a = 255) {
    this.sharedUint8s.set([r, g, b, a])
    return this.sharedPixel[0]
  },

  // Convert a pixel to Uint8s via the shared typed views.
  // sharedOK = true returns the sharedUint8s, useful
  // for one-time computations like finding the pixel r,g,b,a values.
  // Default is to clone the sharedUint8s.
  pixelToUint8s (pixel, sharedOK = false) {
    this.sharedPixel[0] = pixel
    return sharedOK ? // eslint-disable-line
      this.sharedUint8s : new Uint8ClampedArray(this.sharedUint8s)
  },

  // ### Typed Color
  // A typedColor is a 4 element Uint8ClampedArray, with two properties:
  //
  // * pixelArray: A single element Uint32Array view on the Uint8ClampedArray
  // * string: an optional, lazy evaluated, css color string.
  //
  // To create the color from a css string, especially hsl data, use:
  // tc = Color.typedColor(Color.stringToUint8s('hsl(250, 50%, 50%)'))
  // or
  // tc = Color.typedColor(Color.stringToUint8s('PaleTurquoise'))
  //
  // This provides a universal color, good for pixels, webgl & image
  // TypedArrays, and html/css/canvas2d strings.

  typedColor (r, g, b, a = 255) {
    const ua = r.buffer ? r : new Uint8ClampedArray([r, g, b, a])
    ua.pixelArray = new Uint32Array(ua.buffer, ua.byteOffset, 1)
    // Make this an instance of TypedColorProto
    util.setPrototypeOf(ua, TypedColorProto)
    // ua.__proto__ = TypedColorProto
    return ua
  }

}
// initialize sharedPixel and sharedUint8s
Color.sharedPixel = new Uint32Array(1)
Color.sharedUint8s = new Uint8ClampedArray(Color.sharedPixel.buffer)

const TypedColorProto = {
  // Set TypedColorProto prototype to Uint8ClampedArray's prototype
  __proto__: Uint8ClampedArray.prototype,
  // Set the TypedArray; no need for getColor, it *is* the typed Uint8 array
  setColor (r, g, b, a = 255) {
    this.checkColorChange()
    this[0] = r; this[1] = g; this[2] = b; this[3] = a
  },
  // Set the pixel view, changing the shared array (Uint8) view too
  setPixel (pixel) {
    this.checkColorChange()
    this.pixelArray[0] = pixel
  },
  // Get the pixel value
  getPixel () { return this.pixelArray[0] },
  // Set pixel/rgba values to equivalent of the css string.
  //
  // Does *not* set the chached @string, which will be lazily evaluated
  // to its triString. This lets the typedColor remain small without the
  // color string until required by its getter.
  //
  // Note if you set string to "red" or "rgb(255,0,0)", the resulting
  // css string will return the triString #f00 value.
  setString (string) {
    return this.setColor(...Color.stringToUint8s(string))
  },
  // Return the triString for this typedColor, cached in the @string value
  getString () {
    if (this.string == null) this.string = Color.triString(...this)
    return this.string
  },
  // Return true if color is same value as myself, comparing pixels
  equals (color) { return this.getPixel() === color.getPixel() },
  // Housekeeping when a color is modified.
  checkColorChange () {
    // Check for immutable colormap color.
    if (this.colormap) util.error('typedColor: cannot modify ColorMap color.')
    // Reset string on color change.
    this.string = null // will be lazy evaluated via getString.
  }
}

export default Color
