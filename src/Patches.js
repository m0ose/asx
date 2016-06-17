import AgentSet from './AgentSet.js'
import util from './util.js'

class Patches extends AgentSet {
  constructor (model, agentProto, name, baseSet = null) {
    console.log('Patches ctor', arguments)
    super(model, agentProto, name, baseSet)
    // Because JS itself calls the Array ctor, skip if not AgentSet ctor.
    if (typeof model !== 'number') {
      this.world = model.world
      this.populate()
      this.setPixels()
    }
  }
  populate () { // set up all the patches
    util.repeat(this.world.numX * this.world.numY, (i) => {
      this.add(Object.create(this.agentProto))
    })
  }
  // Setup pixels used for `draw` and `importColors`
  setPixels () {
    const {patchSize, numX, numY} = this.world
    const ctx = this.model.contexts.patches
    util.setCtxSmoothing(ctx, false) // crisp rendering
    const pixels = {isPixelPatch: patchSize === 1}
    pixels.ctx = pixels.isPixelPatch ? ctx : util.createCtx(numX, numY)
    // pixels.ctx = patchSize === 1 ? ctx : util.createCtx(numX, numY)
    // if (patchSize === 1)
    //   pixels.ctx = ctx
    // else
    //   pixels.ctx = util.createCtx(numX, numY)
    pixels.imageData = pixels.ctx.getImageData(0, 0, numX, numY)
    pixels.data = pixels.imageData.data
    pixels.data32 = new Uint32Array(pixels.data.buffer)
    this.pixels = pixels
  }
  draw (ctx) {
    const {pixels, world} = this
    if (!pixels.isPixelPatch) util.setIdentity(ctx)
    pixels.ctx.putImageData(pixels.imageData, 0, 0)
    if (pixels.isPixelPatch) return
    ctx.drawImage(pixels.ctx.canvas, 0, 0, world.pxWidth, world.pxHeight)
    ctx.restore()
  }

}

export default Patches
