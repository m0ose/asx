/* eslint no-console: 0 */

// Import the lib/ mmodules

import OofA from 'lib/OofA.js'
import DataSet from 'lib/DataSet.js'
import util from 'lib/util.js'
import LZMA from 'node_modules/lzma/src/lzma_worker.js'
import pako from 'node_modules/pako/dist/pako.js'

// Tests for lib/ modules. Replace eventually with testing libraries.

const ds = new DataSet(2, 3, new Uint8Array([0, 1, 2, 3, 4, 5]))
console.log('ds', ds, 'data', ds.data)

const ctx = ds.toContext()
const id = util.ctxToImageData(ctx)
console.log('to context image data', id.data)

const du = util.ctxToDataUrl(ctx)
const ctx1 = util.createCtx(ctx.canvas.width, ctx.canvas.height)
ctx1.drawImage(ctx.canvas, 0, 0)
const du1 = util.ctxToDataUrl(ctx1)
console.log('du === du1', du === du1)

const ds22 = new DataSet(2, 2, [20, 21, 22, 23])
console.log('ds22', ds22.data)
const ds33 = new DataSet(3, 3, [30, 31, 32, 33, 34, 35, 36, 37, 38])
console.log('ds33', ds33.data)
const [dseast, dssouth] = [ds.concatEast(ds33), ds.concatSouth(ds22)]
console.log('ds.concatEast(ds33)', dseast)
console.log('ds.concatSouth(ds22)', dssouth)

const ds10f = ds.resample(10, 10, false, Float32Array)
console.log('resample ds', util.fixedArray(ds10f.data))
const ds10i = new Uint8Array(ds10f.data.buffer)

const deflate = new pako.Deflate({ level: 3 })
deflate.push(ds10i, true)
const ds10d = deflate.result
const inflate = new pako.Inflate({ level: 3 })
inflate.push(ds10d, true)
const ds10di = inflate.result


const tilef = ds.resample(256, 256, false, Float32Array)
console.log('tilef', tilef)
const tilei = new Uint8Array(tilef.data.buffer)
console.log('tilei', tilei)
// const tc = LZMA.compress(tilei.buffer)
const tc = LZMA.compress(tilei.buffer)


// Debug by adding to window global. Use these in console for testing.
util.mergeObject(window, { DataSet, util, OofA })
util.mergeObject(window,
  { ds, du, ctx, ds22, ds33, dseast, dssouth, ds10f, ds10i })
util.mergeObject(window, { tilef, tilei, tc })
util.mergeObject(window, { pako, ds10d, ds10di })
