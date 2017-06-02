// A small Int24/Uint24 module, mainly for rgb image data

// A shared 4 element Uint8Array array and two 1 element 32bit views
const byteArray = new Uint8Array(4)
const uint24array = new Uint32Array(byteArray.buffer)
const int24array = new Int32Array(byteArray.buffer)

const Int24 = {

  maxUint24: (2 ** 24) - 1,
  minUint24: 0,
  maxInt24: (2 ** 23) - 1,
  minInt24: 0 - (2 ** 23), // REMIND: rollup bug

  checkInt24 (int) {
    if (int < this.minInt24 || int > this.maxInt24)
      throw Error(`Int24: Range error ${int}`)
  },
  checkUint24 (int) {
    if (int < this.minUint24 || int > this.maxUint24)
      throw Error(`Uint24: Range error ${int}`)
  },

  // RGB most common case but any 3 sequential bytes OK
  rgbToInt24 (r, g, b) {
    // byteArray.set([r, g, b, b > 127 ? 255 : 0]) // slow!
    byteArray[0] = r
    byteArray[1] = g
    byteArray[2] = b
    byteArray[3] = b > 127 ? 255 : 0
    return int24array[0]
  },
  rgbToUint24 (r, g, b) {
    byteArray[0] = r
    byteArray[1] = g
    byteArray[2] = b
    byteArray[3] = 0
    return uint24array[0]
  },
  int24ToRGB (int24) {
    this.checkInt24(int24)
    int24array[0] = int24
    // return byteArray.slice(0, 3) // slow!
    return [byteArray[0], byteArray[1], byteArray[2]]
  },
  uint24ToRGB (uint24) {
    this.checkUint24(uint24)
    uint24array[0] = uint24
    return [byteArray[0], byteArray[1], byteArray[2]]
  }

}

export default Int24
