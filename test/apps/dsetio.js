// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import DataSet from 'lib/DataSet.js'
import DataSetIO from 'lib/DataSetIO.js'
import RGBDataSet from 'lib/RGBDataSet.js'
import RGBADataSet from 'lib/RGBADataSet.js'
import AscDataSet from 'lib/AscDataSet.js'

const modules = {
  DataSet, DataSetIO, AscDataSet, RGBDataSet, RGBADataSet, util
}
util.toWindow(modules)
console.log('modules:', Object.keys(modules).join(', '))

const typedArray =
  util.repeat(1e4, (i, a) => { a[i] = i }, new Float32Array(1e4))

const rgbUrl = 'test/data/7.15.35.png' // 112K
// const rgbUrl = 'test/data/10.20.263.png' // 26k

// const rgbaUrl = 'test/data/redfish.png' // 26k
const rgbaUrl = 'test/data/float32.png' // 160K: rgba version of 7.15.35.png

const ascUrl = 'test/data/nldroplets.asc' // 223K
util.toWindow({rgbUrl, rgbaUrl, ascUrl, typedArray})

function * main () {
  const rgbImg = yield util.imagePromise(rgbUrl)
  const rgbDs = new RGBDataSet(rgbImg)
  const rgbaImg = yield util.imagePromise(rgbaUrl)
  const rgbaDs = new RGBDataSet(rgbaImg)
  const ascString = yield util.xhrPromise(ascUrl)
  const ascDs = new AscDataSet(ascString, Float32Array)
  const taDs = new DataSet(100, 100, typedArray)

  const ds = ascDs // rgbDs, rgbaDs, ascDs, taDs
  util.toWindow({rgbImg, rgbDs, rgbaImg, rgbaDs, ascString, ascDs, taDs, ds})

  const json0 = DataSetIO.toJson(ds)
  const json1 = DataSetIO.toJson(ds, 'zip')
  const json2 = yield DataSetIO.toJson(ds, 'lzma')

  util.toWindow({json0, json1, json2})
  console.log('json0, json1, json2', json0.length, json1.length, json2.length)

  const ds0 = DataSetIO.toDataSet(json0)
  const ds1 = DataSetIO.toDataSet(json1)
  const ds2 = yield DataSetIO.toDataSet(json2)

  util.toWindow({ds0, ds1, ds2})
  console.log('ds, ds0, ds1, ds2', ds, ds0, ds1, ds2)
  console.log('ds.data === ds0.data', util.arraysEqual(ds.data, ds0.data))
  console.log('ds0.data === ds1.data', util.arraysEqual(ds0.data, ds1.data))
  console.log('ds1.data === ds2.data', util.arraysEqual(ds1.data, ds2.data))
}
util.runGenerator(main)
