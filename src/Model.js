import util from './util.js'

class Model {
  static defaultWorld () {
    return {
      patchSize: 13,
      minX: -16,
      maxX: 16,
      minY: -16,
      maxY: 16
    }
  }
  static defaultContexts () {
    return { // NOTE: Text Layer?
      patches: { z: 10, ctx: '2d' },
      drawing: { z: 20, ctx: '2d' },
      links: { z: 30, ctx: '2d' },
      turtles: { z: 40, ctx: '2d' }
    }
  }

  constructor (div, worldOptions = {}, contextOptions = {}) {
    const world = Model.defaultWorld()
    Object.assign(world, worldOptions)
    this.setWorld(world)

    this.setDiv(div)

    if (this.div) { // otherwise 'headless'
      const contexts = Model.defaultContexts()
      Object.assign(contexts, contextOptions)
      this.setContexts(contexts, this.world.pxWidth, this.world.pxHeight)
    }
  }

  setWorld (world) {
    world.numX = world.maxX - world.minX + 1
    world.numY = world.maxY - world.minY + 1
    world.pxWidth = world.numX * world.patchSize
    world.pxHeight = world.numY * world.patchSize
    world.minXcor = world.minX - 0.5
    world.maxXcor = world.maxX + 0.5
    world.minYcor = world.minY - 0.5
    world.maxYcor = world.maxY + 0.5
    this.world = world
  }

  setDiv (div) {
    div = util.isString(div) ? document.getElementById(div) : div
    if (div) { // can be null for headless
      // el.setAttribute 'style' erases existing style, el.style.xx does not
      div.style.position = 'relative'
      div.style.width = this.world.pxWidth
      div.style.height = this.world.pxHeight
    }
    this.div = div
  }

  setContexts (contexts, width, height) { // foo:null => no layer for foo
    util.forAll(contexts, (val, key) => {
      if (val === null) return
      const {ctx: ctxType, z: zIndex} = val
      const ctx = util.createCtx(width, height, ctxType)
      this.setCtxTransform(ctx)
      Object.assign(ctx.canvas.style, {
        position: 'absolute', top: 0, left: 0, width, height, zIndex
      })
      this.div.appendChild(ctx.canvas)
      contexts[key] = ctx
      // if (key === 'drawing')
    })
    this.contexts = contexts
  }
  setCtxTransform (ctx) {
    // ctx.canvas.width = this.world.pxWidth
    // ctx.canvas.height = this.world.pxHeight
    ctx.save()
    ctx.scale(this.world.patchSize, -this.world.patchSize)
    ctx.translate(-this.world.minXcor, -this.world.maxYcor)
  }

}

export default Model
