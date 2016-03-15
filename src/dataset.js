import u from 'lib/util.js'

// 2D Dataset: width/height and an array with length = width * height
// The data array can be a TypedArray or a javascript Array
// Note that it is very much like an ImageData object!

class DataSet {
  // Static methods: called via DataSet.foo(), similar to Math.foo().
  // Generally useful utilities for use with TypedArrays & JS Arrays

  // Convert JS or TypedArray to given TypedArray.
  // If array is already of correct type, return it unmodified
  static arrayToTyped(array, Type) {
    if (array.constructor === Type) return array
    return new Type(array)
  }
  // Convert JS or TypedArray to JS Array.
  // If array is already an Array, return it unmodified
  static typedToArray(array) {
    if (array.constructor === Array) return array
    return Array.prototype.slice.call(array)
  }
  // Return a new array that is the concatination two arrays.
  // The resulting type is that of the first array.
  static concat(array1, array2) {
    const Type = array1.constructor
    if (Type === Array)
      return array1.concat(DataSet.typedToArray(array2))
    const array = new Type(array1.length + array2.length)
    array.set(array1); array.set(array2, array1.length)
    return array
  }

  // The DataSet Class constructor and methods

  constructor(width, height, data) {
    if (data.length !== width * height)
      throw `new DataSet length error: ${width} * ${height} != ${data.length}`
    else
      [this.width, this.height, this.data] = [width, height, data]
  }

  // Type() {return this.data.constructor} //

  // throw error if x, y are not legal dataset coords
  checkXY(x, y) {
    if (!(u.between(x, 0, this.width - 1) && u.between(y, 0, this.height - 1)))
      throw `DataSet.checkXY: x,y out of range: ${x}, ${y}`
  }

  // given x,y in data space, return index into data
  toIndex(x, y) { // assume checkXY called b4 use
    return x + y * this.width
  }

  // given index into data, return dataset x,y
  toXY(i) {
    return [i % this.width, Math.floor(i / this.width)]
  }

  // get dataset value at x,y, checking that x,y valid
  // todo: have non checking version
  getXY(x, y) {
    // this.checkXY(x, y)
    return this.data[this.toIndex(x, y)]
  }

  // set the data value at x,y to num
  setXY(x, y, num) {
    // this.checkXY(x, y)
    this.data[this.toIndex(x, y)] = num
  }

  // wrapper for sampling
  sample(x, y, useNearest = true) {
    return useNearest ? this.nearest(x, y) : this.bilinear(x, y)
  }

  // nearest neighbor sampling
  nearest(x, y) {
    // this.checkXY(Math.round(x), Math.round(y))
    return this.getXY(Math.round(x), Math.round(y))
  }

  // [bilinear sampling](http://en.wikipedia.org/wiki/Bilinear_interpolation)
  //
  // Sample using three liner interpolations:
  // 2 in top/bottomm x, 1 between these in y
  bilinear(x, y) {
    this.checkXY(x, y)
    const [x0, y0] = [Math.floor(x), Math.floor(y)]
    const i = this.toIndex(x0, y0)
    const w = this.width
    const [dx, dy] = [(x - x0), (y - y0)] // dx, dy = 0 if x, y on boundary
    const [dx1, dy1] = [1 - dx, 1 - dy] // dx1, dy1 = 1 if x, y on boundary
    // Edge case: fij is 0 if beyond data array; undefined -> 0
    const f00 = this.data[i]
    // Avoid edge case NaN's from return's calculation.
    const f10 = this.data[i + 1] || 0 // 0 at bottom right corner
    const f01 = this.data[i + w] || 0 // 0 at all bottom row
    const f11 = this.data[i + 1 + w] || 0 // 0 at end of next to bottom row
    // dx = 0; dx1 = 1, dy != 0 -> vertical linear interpolation
    //   fxy = f00(1-dy) + f01(dy) i.e. y-lerp
    // dx != 0; dy = 0, dx !=0 -> horizontal linear interpolation
    //   fxy = f00(1-dx) + f10(dx) i.e. x-lerp
    return (f00 * dx1 * dy1) + (f10 * dx * dy1) +
           (f01 * dx1 * dy) + (f11 * dx * dy)
  }

  // Create new dataset of size width/height by resampling each point.
  resample(width, height, useNearest = true) {
    // if (width === this.width && height === this.height & Type === this.type())
    //   return new DataSet(width, height, this.data)
    const ds =
      new DataSet(width, height, new this.data.constructor(width * height))
    // const data = ds.data
    const xScale = (this.width - 1) / (width - 1)
    const yScale = (this.height - 1) / (height - 1)
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++)
        ds.setXY(x, y, this.sample(x * xScale, y * yScale, useNearest))
    return ds
    // return new DataSet(width, height, data)
  }

  // Return a rectangular subset of the dataset.
  // Returned dataset is of same array type as this.
  subset(x, y, width, height) {
    if ((x + width) > this.width || (y + height) > this.height)
      throw 'DataSet.subSet: params out of range'
    const ds =
      new DataSet(width, height, new this.data.constructor(width * height))
    for (let i = 0; i < width; i++)
      for (let j = 0; j < height; j++)
        ds.setXY(i, j, this.getXY(i + x, j + y))
    return ds
  }
  // subset0(x, y, width, height) {
  //   if ((x + width) > this.width || (y + height) > this.height)
  //     throw 'subSet: params out of range'
  //   const data = []
  //   for (let j = 0; j < height; j++)
  //     for (let i = 0; i < width; i++)
  //       data.push(this.getXY(i + x, j + y))
  //   return new DataSet(width, height, data)
  // }

  // Return filtered dataset by applying f to each dataset element
  filter(f) {
    return new DataSet(this.width, this.height, this.data.map(f))
  }

  // return the column of data at position x in the dataset
  col(x) {
    const [colData, data, w, h] = [[], this.data, this.width, this.height]
    if (x >= w)
      throw `col: x out of range width: ${w} x: ${x}`
    for (let i = 0; i < h; i++)
      colData.push(data[x + i * w])
    return colData
  }

  // return the row of data at position y in the dataset
  row(y) {
    const [w, h] = [this.width, this.height]
    if (y >= h)
      throw `row: y out of range height: ${h} x: ${y}`
    return this.data.slice(y * w, (y + 1) * w)
  }

  // Concatinate a dataset of equal height to my right to my east.
  // New DataSet is of same type as this.
  // Generally dataset parameter is of same type as this, or Array
  // but not required.
  // Note: concatWest is dataset.concatEast(this)
  concatEast(dataset) {
    const [w, h] = [this.width, this.height]
    if (h !== dataset.height)
      throw `concatEast: heights not equal ${h}, ${dataset.height}`
    let newData = []
    for (let i = 0; i < h; i++)
      newData = newData.concat(this.row(i).concat(dataset.row(i)))
    return new DataSet(w + dataset.width, h, newData)
  }

  // Concatinate a dataset of equal width to my south, returning new DataSet.
  // New DataSet is of same type as this.
  // Generally dataset parameter is of same type as this, or Array
  // but not required.
  // Note: concatNorth is dataset.concatSouth(this)
  concatSouth(dataset) {
    const [w, h, data] = [this.width, this.height, this.data]
    if (w !== dataset.width)
      throw `concatSouth: widths not equal ${w}, ${dataset.width}`
    let data1 //  = new data.constructor(data.length + dataset.data.length)
    if (data.constructor === Array) {
      data1 = data.concat(dataset.data)
    } else {
      data1 = new data.constructor(data.length + dataset.data.length)
      data1.set(data)
      data1.set(dataset.data, data.length)
    }
    return new DataSet(w, h + dataset.height, data1)
  }
  // concatSouth0(dataset) {
  //   const [w, h, data] = [this.width, this.height, this.data]
  //   if (w !== dataset.width)
  //     throw `concatSouth: widths not equal ${w}, ${dataset.width}`
  //   return new DataSet(w, h + dataset.height, data.concat(dataset.data))
  // }

  // return dataset x,y given x,y in a euclidean space defined by tlx, tly, w, h
  // x,y is in topleft-bottomright box: [tlx,tly,tlx+w,tly-h], y positive up
  // Ex: NetLogo's coords: x, y, minXcor, maxYcor, numX, numY
  transformCoords(x, y, tlx, tly, w, h) {
    const xs = (x - tlx) * (this.width - 1) / w
    const ys = (tly - y) * (this.height - 1) / h
    return [xs, ys]
  }

  // get a sample using a transformed euclidean coord system; see above
  coordSample(x, y, tlx, tly, w, h, useNearest = true) {
    const [xs, ys] = this.transformCoords(x, y, tlx, tly, w, h)
    return this.sample(xs, ys, useNearest)
  }

  // Return Array 3x3 neighbor values of the given x,y of the dataset.
  // Off-edge neighbors revert to nearest edge value.
  neighborhood(x, y, array = []) {
    array.length = 0  // in case user supplied an array
    for (let dy = -1; dy <= +1; dy++) {
      for (let dx = -1; dx <= +1; dx++) {
        const x0 = u.clamp(x + dx, 0, this.width - 1)
        const y0 = u.clamp(y + dy, 0, this.height - 1)
        array.push(this.data[this.toIndex(x0, y0)])
      }
    }
    return array
  }
  // Return a new Array dataset convolved with the given kernel 3x3 matrix.
  // See Convolution article http://goo.gl/ubFiji
  // If cropped, do not convolve the edges, returning a smaller dataset.
  // If not, convolve the edges by extending edge values, no size change
  // Use ds.convertType to convert to typed array
  convolve(kernel, factor = 1, crop = false) {
    const array = [] // new convolved data
    const n = [] // the current neighborhood
    const [x0, y0, h, w] = crop ? // the coords being convolved
      [1, 1, this.height - 1, this.width - 1] :
      [0, 0, this.height, this.width]
    for (let y = y0; y < h; y++) {
      for (let x = x0; x < w; x++) {
        this.neighborhood(x, y, n)
        array.push(u.aSum(u.aPairMul(kernel, n)) * factor)
      }
    }
    return new DataSet(w - x0, h - y0, array)
  }

  // A few common convolutions.  dzdx/y are also called horiz/vert Sobel
  dzdx(n = 2, factor = 1 / 8) {
    return this.convolve([-1, 0, 1, -n, 0, n, -1, 0, 1], factor)
  }
  dzdy(n = 2, factor = 1 / 8) {
    return this.convolve([1, n, 1, 0, 0, 0, -1, -n, -1], factor)
  }
  laplace8() {
    return this.convolve([-1, -1, -1, -1, 8, -1, -1, -1, -1])
  }
  laplace4() {
    return this.convolve([0, -1, 0, -1, 4, -1, 0, -1, 0])
  }
  blur(factor = 0.0625) { // 1/16 = 0.0625
    return this.convolve([1, 2, 1, 2, 4, 2, 1, 2, 1], factor)
  }
  edge() {
    return this.convolve([1, 1, 1, 1, -7, 1, 1, 1, 1])
  }

  // Create two new Array convolved datasets, slope and aspect, common in
  // the use of an elevation data set. See Esri tutorials for
  // [slope](http://goo.gl/ZcOl08) and [aspect](http://goo.gl/KoI4y5)
  // It also returns the two derivitive DataSets, dzdx, dzdy for
  // those wanting to use the results of the two convolutions.
  // Use this.convertType to convert to typed array
  slopeAndAspect(cellSize = 1, noNaNs = true, posAngle = true) {
    const dzdx = this.dzdx() // sub left z from right
    const dzdy = this.dzdy() // sub bottom z from top
    let [aspect, slope] = [[], []]
    const [h, w] = [dzdx.height, dzdx.width]
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let [gx, gy] = [dzdx.getXY(x, y), dzdy.getXY(x, y)]
        slope.push(Math.atan(u.distance(gx, gy)) / cellSize) // radians
        while (noNaNs && gx === gy) {
          gx += u.randomNormal(0, 0.0001); gy += u.randomNormal(0, 0.0001)
        }
        // radians in [-PI,PI], downhill
        let rad = (gx === gy && gy === 0) ? NaN : Math.atan2(-gy, -gx)
        // positive radians in [0,2PI] if desired
        if (posAngle && rad < 0) rad += 2 * Math.PI
        aspect.push(rad)
      }
    }
    slope = new DataSet(w, h, slope)
    aspect = new DataSet(w, h, aspect)
    return { slope, aspect, dzdx, dzdy }
  }

  // Convert dataset to an image context object.
  // This can be used to "visualize" the data by normalizing
  // which will scale the data to use the entire RGB space.
  // It can also be used to create tiles or image-as-data if
  // the defaults are used.
  // Due to alpha-premultiply, the best we can do is 24 bit ints.
  // You can simulate floats/fixed by multiplying the dataset
  // the dividing on conversion back.
  // Our preferred transport is in the works, likely in the
  // tile datasets via blobs or arraybuffers. Sigh.
  toContext(normalizeImage = false, gray = false, alpha = 255) {
    const [w, h, data] = [this.width, this.height, this.data]
    let idata
    if (normalizeImage) {
      idata = gray ?
        u.normalize8(data) : u.normalizeInt(data, 0, Math.pow(2, 24) - 1)
    } else {
      idata = data.map(a => Math.round(a))
    }
    const ctx = u.createCtx(w, h)
    const id = ctx.getImageData(0, 0, w, h)
    const ta = id.data // ta short for typed array
    for (let i = 0; i < idata.length; i++) {
      const [num, j] = [idata[i], 4 * i] // j = byte index into ta
      if (gray) {
        ta[j] = ta[j + 1] = ta[j + 2] = Math.floor(num); ta[j + 3] = alpha
      } else {
        ta[j] = (num >> 16) & 0xff
        ta[j + 1] = (num >> 8) & 0xff
        ta[j + 2] = num & 0xff
        ta[j + 3] = 255
      }
    }
    console.log('toContext image data', id.data)
    ctx.putImageData(id, 0, 0)
    console.log('toContext new image data', u.ctxToImageData(ctx).data)
    return ctx
  }

  // Convert dataset to a canvas, which can be used as an image
  toCanvas(gray, normalizeImage = true, alpha = 255) {
    return this.toContext(gray, normalizeImage, alpha).canvas
  }
  // Convert dataset to a base64 string
  toDataUrl(gray, normalizeImage = true, alpha = 255) {
    return u.ctxToDataUrl(this.toContext(gray, normalizeImage, alpha))
  }

  // Convert dataset's data to new type. Precision may be lost.
  // Does nothing if current data is already of this Type.
  convertType(Type) {
    if (this.data.constructor === Type) return
    this.data = (Type === Array) ?
      DataSet.typedToArray(this.data, Type) :
      DataSet.arrayToTyped(this.data, Type)
  }

}

export default DataSet
