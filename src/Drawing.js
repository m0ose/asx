// import util from './util.js'

// This implements the Drawing Layer of NetLogo.

class Drawing {
  constructor (world) {
    const can = document.createElement('canvas')
    this.ctx = can.getContext('2d')
    world.setCtxTransform(this.ctx)
  }
  clear () {
    this.ctx.save()
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.restore()
  }
}

export default Drawing
