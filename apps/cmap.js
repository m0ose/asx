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

const tc = Color.typedColor(255, 0, 0)
console.log('typedColor tc: color', tc.toString(), 'string', tc.getString(), 'pixel', tc.getPixel())

const tcstr = Color.toTypedColor('red')
const tcpix = Color.toTypedColor(4278190335) // red
const tca = Color.toTypedColor([255, 0, 0])
const tcta = Color.toTypedColor(new Uint8Array([255, 0, 0, 255]))

console.log('toTypedColor: tcstr, tcpix, tca, tcta',
  tcstr.toString(), tcpix.toString(), tca.toString(), tcta.toString())
util.copyTo(window, { tc, tcstr, tcpix, tca, tcta })

// util.step(10, 2, (i) => console.log(i))
const gid = cmap.gradientImageData(10, ['red', 'green'])
console.log('gradientImageData', gid)

const gic = cmap.typedArrayToTypedColors(gid)
console.log('gradientImageColors', util.arraysToString(gic))

const c0 = gic[0]
console.log('color0', c0, c0.getPixel(), c0.getString())

const rgbs = cmap.permuteRGBColors(2, 2, 3)
console.log('permuteRGBColors(2,2,3)', util.arraysToString(rgbs))
console.log('permuteRGBColors length)', rgbs.length)

const trgbs = cmap.arraysToColors(rgbs)
console.log('arraysToColors', util.arraysToString(trgbs))

const basicmap = cmap.basicColorMap(rgbs)
console.log('basicmap', basicmap.toString())
console.log('basicmap prototypes'); util.pps(basicmap)
const basicmap0 = basicmap[0]
console.log('basicmap[0] prototypes', basicmap0); util.pps(basicmap0)

console.log('lookup basicmap[5]', basicmap.lookup(basicmap[5]))
basicmap.createIndex()
console.log('lookup basicmap[5] w/ index', basicmap.lookup(basicmap[5]))

console.log('random color', basicmap.randomColor())

console.log('scaleColor(i, 0, 5) for i in [0, 5]')
util.repeat(6, (i) => {
  const c = basicmap.scaleColor(i, 0, 5)
  const ix = basicmap.lookup(c)
  console.log('c', c, 'i', i, 'ix', ix)
})

const webglArray = basicmap.webglArray()
console.log('webglArray', webglArray)

const graymap = cmap.grayColorMap(16)
console.log('graymap(16)', graymap.toString())

const rgbcube = cmap.rgbColorCube(4, 4, 2)
console.log('rgbcube(4,4,2)', rgbcube.toString())

const rgbmap = cmap.rgbColorMap([100, 200, 300], [255], [128, 255])
console.log('rgbmap([100,200,300],[255],[128,255])', rgbmap.toString())

const hslmap = cmap.hslColorMap(util.aIntRamp(0, 350, 25))
console.log('hslColorMap(util.aIntRamp(0, 350, 100))', hslmap.toString())

const gradientmap = cmap.gradientColorMap(50, cmap.jetColors)
console.log('cmap.jetColors:', util.arraysToString(cmap.jetColors))
console.log('gradientColorMap(50, cmap.jetColors)', gradientmap.toString())

const redorange = cmap.gradientColorMap(11, ['red', 'blue'])
console.log('red-blue gradient', redorange.toString())
const nlred = cmap.gradientColorMap(11, ['black', 'red', 'white'])
console.log('NetLogo red ramp', nlred.toString())

const cssmap = cmap.cssColorMap(cmap.basicColorNames)
console.log('cssmap(basicColorNames)', cssmap.toString())

util.copyTo(window, { gid, gic, c0, rgbs, trgbs, basicmap, basicmap0, webglArray, graymap, rgbcube, rgbmap, hslmap, gradientmap, redorange, cssmap })

util.repeat(5, (i) => {
  const r = c.randomTypedColor()
  const rc = rgbcube.rgbClosestColor(...r)
  console.log(i, r.toString(), rc.toString())
})
