// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import DataSet from 'lib/DataSet.js'
import DataSetIO from 'lib/DataSetIO.js'
import RGBDataSet from 'lib/RGBDataSet.js'

// const modules = {
//   AgentSet, Animator, Color, ColorMap, DataSet, DataSetIO,
//   Mouse, Model, OofA, Patch, Patches, RGBDataSet, util
// }
// util.toWindow(modules)
// console.log('modules:', Object.keys(modules).join(', '))

const typedArray = util.repeat(1e4, (i, a) => { a[i] = i }, new Uint8Array(1e4))
const useImg = true

// const imageUrl = 'test/data/test.png' // 26k
const imageUrl = 'test/data/7.15.35.png' // 112K
// const imageUrl = 'test/data/10.20.263.png' // 26k
const png24 = imageUrl.match(/.*\/[0-9]/) != null

function * main () {
  const img = yield util.imagePromise(imageUrl)
  const ds = !useImg ? new DataSet(100, 100, typedArray)
    : png24 ? new RGBDataSet(img)
    : new DataSet(4 * img.width, img.height, util.imageToPixels(img, true))

  // const ds = new DataSet(100, 100, typedArray)
  util.toWindow({typedArray, ds})

  const json0 = DataSetIO.toJson(ds)
  const json1 = DataSetIO.toJson(ds, 'zip')
  const json2 = yield DataSetIO.toJson(ds, 'lzma')

  util.toWindow({json0, json1, json2})
  console.log('json0, json1, json2', json0.length, json1.length, json2.length)

  const ds0 = DataSetIO.toDataSet(json0)
  const ds1 = DataSetIO.toDataSet(json1)
  const ds2 = yield DataSetIO.toDataSet(json2)

  util.toWindow({ds0, ds1, ds2})
  console.log('ds0, ds1, ds2', ds0, ds1, ds2)
  console.log('ds.data === ds0.data', util.arraysEqual(ds.data, ds0.data))
  console.log('ds0.data === ds1.data', util.arraysEqual(ds0.data, ds1.data))
  console.log('ds1.data === ds2.data', util.arraysEqual(ds1.data, ds2.data))
}
util.runGenerator(main)
