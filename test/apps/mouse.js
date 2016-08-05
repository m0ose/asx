// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import Model from 'lib/Model.js'
import Mouse from 'lib/Mouse.js'
import ColorMap from 'lib/ColorMap.js'

const modules = { Mouse, Model, util }
util.toWindow(modules)
console.log('modules:', Object.keys(modules).join(', '))

class MouseTest extends Model {
  setup () {
    for (const p of this.patches) {
      p.mycolor = 0
    }
    this.mouse = new Mouse(this, true, (evt) => {
      // console.log(evt.x, evt.y)
      let [x,y] = [Math.round(evt.x), Math.round(evt.y)]
      let p = model.patches.patchXY(x, y)
      try {
        p.mycolor = Math.random()
      } catch (err) {
        console.warn('patch not defined', x, y)
      }
      this.once()
    })
    this.mouse.start()
    this.cmap = ColorMap.Jet
  }

  step () {
    for (const p of this.patches) {
      p.setColor(this.cmap.scaleColor(p.mycolor, 0, 1))
    }
  }
}
const model = new MouseTest('layers', {
  patchSize: 2,
  minX: -125,
  maxX: 125,
  minY: -125,
  maxY: 125
}) // don't start, mouse driven instead
model.once()
util.toWindow({model, mouse: model.mouse})
