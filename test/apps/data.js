// Import the lib/ mmodules via relative paths
import OofA from 'lib/OofA.js'
import DataSet from 'lib/DataSet.js'
import AgentSet from 'lib/AgentSet.js'
import Color from 'lib/Color.js'
import ColorMap from 'lib/ColorMap.js'
import util from 'lib/util.js'
import LZMA from 'node_modules/lzma/src/lzma_worker.js'
import lzma from 'node_modules/lzma/src/lzma.js'
import pako from 'node_modules/pako/dist/pako.js'

const modules =
  { DataSet, util, OofA, AgentSet, Color, ColorMap, LZMA, lzma, pako }
util.toWindow(modules)
window.pps = util.pps
console.log(Object.keys(modules).join(' '))

const imageUrl = 'test/data/redfish128t.png'

const array8toUint8 = (array) => new Uint8Array(new Int8Array(array).buffer)
const uint8toArray8 = (uint8s) =>
  util.convertArray(new Int8Array(uint8s.buffer), Array)

util.imagePromise(imageUrl)
.then((img) => {
  const pixels = util.imageToPixels(img, true)
  const pixelsbas64 = util.bufferToBase64(pixels)
  const pix = LZMA.compress(pixels, 9)
  console.log('LZMA: pixels compression', pixels.length, pix.length)
  const pixd = LZMA.decompress(pix)
  console.log('LZMA: pixels = pixd', util.arraysEqual(pixels, pixd))
  const pixInt8 = new Int8Array(pix)
  console.log('LZMA: pix = pixInt8', util.arraysEqual(pix, pixInt8))
  const pixUint8 = new Uint8Array(pix) // Uint & Int same values
  const pixd8 = LZMA.decompress(new Int8Array(pixUint8.buffer))
  console.log('LZMA: pixels = pixd8', util.arraysEqual(pixels, pixd8))
  const pixbase64 = util.bufferToBase64(pixUint8)
  console.log('LZMA: base64 compression', pixelsbas64.length, pixbase64.length)
  util.toWindow({
    img, pixels, pixelsbas64, pix, pixInt8, pixUint8, pixbase64, pixd, pixd8
  })
  console.log('img', img, 'pixels', pixels.length)
})
.catch((response) => console.log(response))

// http://stackoverflow.com/questions/18522687/how-to-get-the-pixel-data-of-an-png-downloaded-using-xmlhttprequest-xhr2
// util.xhrPromise(imageUrl, 'arraybuffer', 'GET')
// .then((arraybuffer) => {
//   console.log(arraybuffer)
//   const xpixels = new Uint8Array(arraybuffer)
//   util.toWindow({ arraybuffer, xpixels })
//   console.log('arraybuffer', arraybuffer, 'xpixels', xpixels.length)
// })
// .catch((response) => console.log(response))
// // NOTE: xpixels.length === size of .png file

const id = new ImageData(10, 5)
util.repeat(id.data.length, (i) => { id.data[i] = i })
const idpx = util.imageToPixels(id)
const idbase64 = util.bufferToBase64(idpx)
util.toWindow({ id, idpx, idbase64 })

const blob = new Blob([idpx], {type: 'application/octet-binary'})
const bloburl = URL.createObjectURL(blob)
util.toWindow({ blob, bloburl })
