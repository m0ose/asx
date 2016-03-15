import DataSet from 'lib/DataSet.js'
import util from 'lib/util.js'

const ds = new DataSet(2, 3, [0, 1, 2, 3, 4, 5])
console.log(ds) // eslint-disable-line

const ctx = window.ctx = ds.toContext()
const id = window.id = util.ctxToImageData(ctx)
console.log(`id ${id.data}`) // eslint-disable-line

const du = window.du = util.ctxToDataUrl(ctx)
const ctx1 = window.ctx1 = util.createCtx(ctx.canvas.width, ctx.canvas.height)
ctx1.drawImage(ctx.canvas, 0, 0)
const du1 = window.du1 = util.ctxToDataUrl(ctx1)
console.log(`du === du1 ${du === du1}`) // eslint-disable-line


// Debug
window.ds = ds
window.DataSet = DataSet
window.util = util
