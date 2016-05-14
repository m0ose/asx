/* eslint no-console: 0 */

// Import the lib/ mmodules via relative paths
import Color from './Color.js'
import ColorMap from './ColorMap.js'
import util from './util.js'

util.copyTo(window, { util, Color, ColorMap })
var { util: u, Color: c, ColorMap: cmap } = { util, Color, ColorMap }
util.copyTo(window, { u, c, cmap })

console.log('util, Color, ColorMap')
console.log('u, c, cmap')

// u.step(10, 2, (i) => console.log(i))
const gid = cmap.gradientImageData(10, ['red', 'green'])
console.log('gradientImageData', gid)
// const gia = cmap.uint8ArrayToUint8s(gid)
// console.log('gradientImageArrays', u.arraysToString(gia))

const gic = cmap.typedArrayToTypedColors(gid)
console.log('gradientImageColors', u.arraysToString(gic))

const c0 = gic[0]
console.log('color0', c0, c0.getPixel(), c0.getString())

const rgbs = cmap.permuteRGBColors(2, 2, 3)
console.log('permuteRGBColors(2,2,3)', u.arraysToString(rgbs))
console.log('permuteRGBColors length)', rgbs.length)

const trgbs = cmap.arrayToColors(rgbs)
console.log('arrayToColors', u.arraysToString(trgbs))

const rgbcmap = cmap.basicColorMap(rgbs)
console.log('rgbcmap'); util.pps(rgbcmap)
const rgbcmap0 = rgbcmap[0]
console.log('rgbcmap[0]', rgbcmap0); util.pps(rgbcmap0)

console.log('lookup rgbcmap[5]', rgbcmap.lookup(rgbcmap[5]))
rgbcmap.createIndex()
console.log('lookup rgbcmap[5] w/ index', rgbcmap.lookup(rgbcmap[5]))

console.log('random color', rgbcmap.randomColor())

console.log('scaleColor(i, 0, 5) for i in [0, 5]')
util.repeat(6, (i) => {
  const c = rgbcmap.scaleColor(i, 0, 5)
  const ix = rgbcmap.lookup(c)
  console.log('c', c, 'i', i, 'ix', ix)
})

const webglArray = rgbcmap.webglArray()
console.log('webglArray', webglArray)

util.copyTo(window,
  { gid, gic, c0, rgbs, trgbs, rgbcmap, rgbcmap0, webglArray }
)
