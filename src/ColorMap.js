import util from './util.js'
import Color from './Color.js'

// A colormap is simply an array of typedColors with a few utilities such
// as randomColor etc. This allows the colors to be simple integer indices
// into the Array.

const ColorMap = {
  // ### Color Array Utilities
  // Several utilities for creating color arrays

  // ### Gradients

  // Ask the browser to use the canvas gradient feature
  // to create nColors given the gradient color stops and locs.
  // See Mozilla [Gradient Doc](
  //   https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient),
  //
  // Stops are css strings or rgba arrays.
  // Locs are floats from 0-1, default is equally spaced.
  //
  // This is a powerful browser feature, can be
  // used to create all the MatLab colormaps.
  // See these gradient sites:
  // Colorzilla [Gradient Editor](
  //   http://www.colorzilla.com/gradient-editor/),
  // GitHub [ColorMap Project](
  //   https://github.com/bpostlethwaite/colormap)
  gradientImageData (nColors, stops, locs) {
    // Convert the color stops to css strings
    stops = stops.map((c) => Array.isArray(c) ? Color.rgbaString(...c) : c)
    const ctx = util.createCtx(nColors, 1)
    // Install default locs if none provide
    if (!locs) locs = util.aRamp(0, 1, stops.length)
    // create a new gradient and fill it with the color stops
    const grad = ctx.createLinearGradient(0, 0, nColors, 0)
    util.repeat(stops.length, (i) => grad.addColorStop(locs[i], stops[i]))
    // draw the gradient returning the image data TypedArray
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, nColors, 1)
    return util.ctxToImageData(ctx).data
  },

  // ### Array Conversion Utilities

  // Convert Uint8Array into Array of 4 element typedColors.
  // Useful for converting ImageData objects like gradients to colormaps.
  // WebGL ready: the array.typedArray is suitable for Attribute Buffers
  typedArrayToTypedColors (typedArray) {
    const array = []
    util.step(typedArray.length, 4,
      (i) => array.push(Color.typedColor(typedArray.subarray(i, i + 4))))
    array.typedArray = typedArray
    return array
  },
  // Convert an Array of Arrays to an Array of typedColors
  // Webgl ready as above.
  arrayToColors (array) {
    const typedArray = new Uint8ClampedArray(array.length * 4)
    util.repeat(array.length, (i) => {
      const a = array[i]
      if (a.length === 3) a.push(255)
      typedArray.set(a, i * 4)
    })
    return this.typedArrayToTypedColors(typedArray)
  },

  // Permute the values of 3 arrays. Ex:
  //
  // [1,2], [3], [4,5] -> [ [1,3,4],[1,3,5],[2,3,4],[2,3,5] ]
  permuteArrays (A1, A2 = A1, A3 = A1) {
    const array = []
    for (let a1 of A1)
      for (let a2 of A2)
        for (let a3 of A3)
          array.push([a1, a2, a3])
    return array
  },

  // Use permuteArrays to create uniformly spaced color ramp permutation.
  // Ex: if numRs is 3, permuteArrays's A1 would be [0, 127, 255]
  permuteRGBColors (numRs, numGs = numRs, numBs = numRs) {
    const toRamp = (num) => util.aIntRamp(0, 256, num)
    const ramps = [numRs, numGs, numBs].map(toRamp)
    return this.permuteArrays(...ramps)
  },

  // ### ColorMaps

  // ColorMaps are Arrays of TypedColors with these methods.
  // Webgl ready if made with typedArrayToTypedColors or arrayToColors above.
  ColorMapProto: {
    __proto__: Array.prototype,
    // Create a [sparse array](https://goo.gl/lQlq5k) of index[pixel] = pixel.
    // Used by lookup below for exact match of a color within the colormap.
    createIndex () {
      this.index = []
      util.repeat(this.length, (i) => {
        const px = this[i].getPixel()
        this.index[px] = i
      })
    },
    // Return a random index into the colormap array
    randomIndex () { return util.randomInt(this.length) },
    // Return a random color within the colormap
    randomColor () { return this[this.randomIndex()] },
    // Return the index of a color within the colormap, undefined if no match.
    lookup (color) {
      if (this.index) return this.index[color.getPixel()]
      for (let i = 0; i < this.length; i++)
        if (color.equals(this[i])) return i
      return undefined
    },
    // Return color scaled by number within [min, max].
    // A linear interpolation (util.lerp) in [0, length-1]
    //
    // Ex: scaleColor(25, 0, 50) returns the color in the middle of the colormap
    scaleColor (number, min, max) {
      // number = util.clamp(number, min, max)
      const scale = util.lerpScale(number, min, max)
      const index = Math.round(util.lerp(0, this.length - 1, scale))
      return this[index]
    },
    // Return the typedArray used to create the typedColors,
    // undefined if not webgl ready.
    webglArray () { return this.typedArray }
    // findClosestIndex: function(r, g, b, a) {
    //   var b0, bLoc, c, color, d, g0, gLoc, i, ix, ixMin, j, len, minDist, r0, rLoc, ref, ref1, ref2, step;
    //   if (a == null) {
    //     a = 255;
    //   }
    //   if (g == null) {
    //     ref = Color.colorToArray(r), r = ref[0], g = ref[1], b = ref[2], a = ref[3];
    //   }
    //   if (this.cube) {
    //     step = 255 / (this.cube - 1);
    //     ref1 = (function() {
    //       var j, len, ref1, results;
    //       ref1 = [r, g, b];
    //       results = [];
    //       for (j = 0, len = ref1.length; j < len; j++) {
    //         c = ref1[j];
    //         results.push(Math.round(c / step));
    //       }
    //       return results;
    //     })(), rLoc = ref1[0], gLoc = ref1[1], bLoc = ref1[2];
    //     return rLoc + gLoc * this.cube + bLoc * this.cube * this.cube;
    //   }
    //   if (ix = this.lookup([r, g, b, a])) {
    //     return ix;
    //   }
    //   minDist = Infinity;
    //   ixMin = 0;
    //   for (i = j = 0, len = this.length; j < len; i = ++j) {
    //     color = this[i];
    //     ref2 = Color.colorToArray(color), r0 = ref2[0], g0 = ref2[1], b0 = ref2[2];
    //     d = Color.rgbDistance(r0, g0, b0, r, g, b);
    //     if (d < minDist) {
    //       minDist = d;
    //       ixMin = i;
    //     }
    //   }
    //   return ixMin;
    // },
    // findClosestColor: function(r, g, b, a) {
    //   if (a == null) {
    //     a = 255;
    //   }
    //   return this[this.findClosestIndex(r, g, b, a)];
    // }
  },
  // Convert an array of rgb(a) arrays to a webgl-ready colormap.
  basicColorMap (array) {
    array = this.arrayToColors(array)
    util.setPrototypeOf(array, this.ColorMapProto)
    return array
  }

}

export default ColorMap
