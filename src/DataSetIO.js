// Export/Import DataSets
import DataSet from 'lib/DataSet.js'
import util from 'lib/util.js'
import LZMA from 'etc/lzma.js'
import pako from 'etc/pako.min.js'
const lzma = new LZMA('etc/lzma_worker.js')

const DataSetIO = {
  // JSON import/export. The JSON returned looks like:
  // ```
  // {
  //   width: dataset.width,
  //   height: dataset.height,
  //   data64: base64, // base64 string of DataSet data
  //   type: 'Array', // dataset data array type: TypedArray or Array
  //   compression: string, // 'none', 'zip', 'lzma',
  //   level: num // 0-9, 0 least, 9 most compressed
  // }
  // ```
  compressionNames: ['none', 'zip', 'lzma'],
  checkCompression (compression) {
    if (this.compressionNames.indexOf(compression) < 0)
      util.error(`DataSetIO: illegal compression ${compression}`)
  },

  // The lzma compressor uses a webworker, therefore async
  lzmaCompressPromise (dataset, level = 9) {
    const dataUint8 = util.arrayToBuffer(dataset.data)
    return new Promise((resolve, reject) => {
      lzma.compress(dataUint8, level, (result, error) => {
        if (error) reject(error)
        const uint8array = result.buffer ? result : new Uint8Array(result)
        const json = this.buildJson(dataset, uint8array, 'lzma', level)
        resolve(json)
      })
    })
  },
  lzmaDecompressPromise (jsonObj) {
    const {width, height, data64, type} = jsonObj
    const dataUint8 = util.base64ToBuffer(data64)
    return new Promise((resolve, reject) => {
      lzma.decompress(dataUint8, (result, error) => {
        if (error) reject(error)
        const uint8array = new Uint8Array(result)
        const data = util.bufferToArray(uint8array, window[type])
        resolve(new DataSet(width, height, data))
      })
    })
  },

  toJson (dataset, compression = 'none', level = 9) {
    this.checkCompression(compression)
    if (compression === 'lzma')
      return this.lzmaCompressPromise(dataset, level)

    let uint8array = util.arrayToBuffer(dataset.data)
    if (compression === 'zip')
      uint8array = pako.deflate(uint8array, {level})

    return this.buildJson(dataset, uint8array, compression, level)
  },
  buildJson (dataset, uint8array, compression, level) {
    const data64 = util.bufferToBase64(uint8array)
    return JSON.stringify({
      width: dataset.width,
      height: dataset.height,
      data64: data64,
      type: dataset.data.constructor.name,
      compression: compression,
      level: level
    })
  },
  isLZMA (json) {
    return json.search(/compression":"lzma/) >= 0
  },
  toDataSet (json) {
    const jsonObj = JSON.parse(json)
    const {compression, type, width, height, data64} = jsonObj
    this.checkCompression(compression)

    if (compression === 'lzma')
      return this.lzmaDecompressPromise(jsonObj)

    let uint8array = util.base64ToBuffer(data64)
    if (compression === 'zip')
      uint8array = pako.inflate(uint8array)
    const data = util.bufferToArray(uint8array, window[type])

    return new DataSet(width, height, data)
  }
}

export default DataSetIO
