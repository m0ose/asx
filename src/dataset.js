import u from 'src/util.js'

class DataSet {
  // 2D Dataset: width/height and an array with length = width * height
  constructor (width = 0, height = 0, data = []) {
    this.reset(width, height, data)
  }

  reset (width, height, data) {
    if (data.length !== width * height)
      throw 'DataSet.reset: data length error'
    else
      [this.width, this.height, this.data] = [width, height, data]
  }

  checkXY (x, y) {
    if ( !u.isIn(x, 0, this.width) || !u.isIn(y, 0, this.height) )
      throw `checkXY: x,y out of range: ${x}, ${y}`
  }

  sample (x, y, useNearest = true) {
    return useNearest ? this.nearest(x, y) : this.bilinear(x, y)
  }




}

export default DataSet
