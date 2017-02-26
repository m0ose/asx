import util from './util.js'

// Sprites are images/drawings within a sprite-sheet.
class SpriteSheet {
  static getPaths () { return paths }
  constructor (spriteSize = 128, spritesPerRow = 8, usePowerOf2 = true) {
    Object.assign(this, {spriteSize, spritesPerRow, usePowerOf2})
    this.rows = 1
    this.nextCol = 0
    this.nextRow = 0
    this.sprites = {}
    if (usePowerOf2) this.checkPowerOf2()
    this.ctx = util.createCtx(this.width, spriteSize)
  }
  // width & height in pixels
  get width () { return this.spriteSize * this.spritesPerRow }
  get height () { return this.spriteSize * this.rows }
  // next col, row in pixels
  get nextX () { return this.spriteSize * this.nextCol }
  get nextY () { return this.spriteSize * this.nextRow }
  // id = number of sprites
  get id () { return Object.keys(this.sprites).length }
  checkPowerOf2 () {
    const {width, height} = this
    if (!(util.isPowerOf2(width) && util.isPowerOf2(height)))
      util.error(`SpriteSheet non power of 2: ${width}x${height}`)
  }

  addSprite (img, name = `sprite${this.id}`) {
    if (this.sprites[name]) util.error(`addSprite: ${name} already used`)
    this.checkSheetSize() // Resize ctx if nextRow > rows
    const [x, y, size] = [this.nextX, this.nextY, this.spriteSize]
    this.ctx.drawImage(img, x, y, size, size)
    const id = this.id // Object.keys(this.sprites).length
    const {nextRow: row, nextCol: col} = this
    const sprite = {id, x, y, row, col, size}
    this.sprites[name] = sprite
    this.incrementRowCol()
    return sprite
  }
  getSprite (name) { return this.sprites[name] }
  // Resize ctx if nextRow > rows
  incrementRowCol () {
    this.nextCol += 1
    if (this.nextCol < this.spritesPerRow) return
    this.nextCol = 0
    this.nextRow += 1
  }
  // Resize ctx if too small for next row/col
  checkSheetSize () {
    if (this.nextRow === this.rows) { // this.nextCol should be 0
      this.rows = (this.usePowerOf2) ? this.rows * 2 : this.rows + 1
      util.resizeCtx(this.ctx, this.width, this.height)
    }
  }

  // Create a sprite image. See [Drawing shapes with canvas](https://goo.gl/uBwxMq)
  //
  // The drawFcn args: drawFcn(ctx).
  // The ctx fill & stroke styles are pre-filled w/ fillColor, strokeColor.
  //
  // If useHelpers:
  // - Transform to -1 -> +1 coords
  // - drawFcn is surrounded with ctx beginPath & closePath, fill fcns.
  //
  // If not using helpers, ctx.canvas.width/height is the size of drawing,
  // top/left canvas coordinates.
  drawImage (drawFcn, fillColor, strokeColor = 'black', useHelpers = true) {
    // const paths = paths
    const ctx = util.createCtx(this.spriteSize, this.spriteSize)
    ctx.fillStyle = fillColor
    ctx.strokeStyle = strokeColor
    // console.log('drawImage', paths, ctx.fillStyle, ctx.strokeStyle)
    if (util.isString(drawFcn)) drawFcn = paths[drawFcn]
      // drawFcn = (ctx) => { paths[drawFcn](ctx) }
    if (useHelpers) {
      // ctx.paths = paths
      ctx.scale(this.spriteSize / 2, this.spriteSize / 2)
      ctx.translate(1, 1)
      ctx.beginPath()
    }
    drawFcn(ctx)
    if (useHelpers) {
      ctx.closePath()
      ctx.fill()
    }
    return ctx.canvas
  }

}

const paths = {
  poly (ctx, points) {
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt[0], pt[1])
      else ctx.lineTo(pt[0], pt[1])
    })
  },
  default (ctx) { this.dart(ctx) },
  arrow (ctx) {
    paths.poly(ctx,
      [[1, 0], [0, 1], [0, 0.4], [-1, 0.4], [-1, -0.4], [0, -0.4], [0, -1]])
  },
  circle (ctx) { ctx.arc(0, 0, 1, 0, 2 * Math.PI) },
  dart (ctx) { paths.poly(ctx, [[1, 0], [-1, 0.8], [-0.5, 0], [-1, -0.8]]) },
  ring (ctx) { // transparent
    const [rOuter, rInner] = [1, 0.6]
    ctx.arc(0, 0, rOuter, 0, 2 * Math.PI, false) // x, y, r, ang0, ang1, cclockwise
    ctx.lineTo(rInner, 0)
    ctx.arc(0, 0, rInner, 0, 2 * Math.PI, true)
  },
  ring2 (ctx) { // fileStyle is outer color, strokeStyle inner color
    const [rOuter, rInner] = [1, 0.6]
    ctx.arc(0, 0, rOuter, 0, 2 * Math.PI) // x, y, r, ang0, ang1, cclockwise
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = ctx.strokeStyle
    ctx.arc(0, 0, rInner, 0, 2 * Math.PI) // x, y, r, ang0, ang1, cclockwise
  },
  square (ctx) { ctx.fillRect(-1, -1, 2, 2) },
  square2 (ctx) {
    const inset = 0.4
    ctx.fillRect(-1, -1, 2, 2)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = ctx.strokeStyle
    ctx.fillRect(-1 + inset, -1 + inset, 2 - (2 * inset), 2 - (2 * inset))
  },
  triangle (ctx) { paths.poly(ctx, [[1, 0], [-1, -0.8], [-1, 0.8]]) }
}

export default SpriteSheet
