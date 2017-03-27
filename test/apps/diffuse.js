// Import the lib/ mmodules via relative paths
import ColorMap from 'lib/ColorMap.js'
import DataSet from 'lib/DataSet.js'
import Mouse from 'lib/Mouse.js'
import Model from 'lib/Model.js'
import util from 'lib/util.js'

const modules = { ColorMap, DataSet, Mouse, Model, util }
util.toWindow(modules)
console.log(Object.keys(modules).join(', '))

class PatchModel extends Model {
  setup () {
    this.patches.own('ran ds')
    // this.anim.setRate(60)
    this.cmap = ColorMap.Rgb256 // this.cmap = ColorMap.Jet
    this.mouse = new Mouse(this, true).start()
    for (const p of this.patches) {
      p.ran = util.randomFloat(1.0)
      p.ds = 0
    }
  }
  step () {
    // REMIND: Three mouse picking
    this.patches.diffuse('ran', 0.05, this.cmap)
  }
}
// const [div, size, max, min] = ['model', 4, 50, -50]
const [size, max, min] = [2, 100, -100]
const opts =
  {patchSize: size, minX: 2 * min, maxX: 2 * max, minY: min, maxY: max}
const model = new PatchModel(document.body, opts).start()
console.log('patches:', model.patches.length)

// debugging
const {world, patches, turtles, links} = model
util.toWindow({ model, world, patches, turtles, links })
