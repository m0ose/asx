import u from 'src/util.js'

class DataSet {
  // 2D Dataset: width/height and an array with length = width * height
  constructor(width = 0, height = 0, data = []) {
    this.reset(width, height, data)
  }

  reset(width, height, data) {
    if (data.length !== width * height)
      u.error('DataSet.reset: data length error')
    else
      [this.width, this.height, this.data] = [width, height, data]
  }

}

export default DataSet
