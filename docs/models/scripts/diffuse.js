// import ColorMap from '../../dist/AS/ColorMap.js'
// import DataSet from '../../dist/AS/DataSet.js'
// import Model from '../../dist/AS/Model.js'
// import util from '../../dist/AS/util.js'
const {ColorMap, DataSet, Model, util} = AS

util.toWindow({ ColorMap, DataSet, Model, util })

class DiffuseModel extends Model {
  setup () {
    this.patches.own('ran ds')

    this.cmap = ColorMap.Rgb256 // this.cmap = ColorMap.Jet
    // REMIND: Three mouse picking: this.mouse = new Mouse(this, true).start()
    this.patches.ask(p => {
      p.ran = util.randomFloat(1.0)
      p.ds = 0
    })
  }
  step () {
    this.patches.diffuse('ran', 0.05, this.cmap)
  }
}

const opts = Model.defaultOptions(2, 100)
opts.minX = 2 * opts.minX
opts.maxX = 2 * opts.maxY
const model = new DiffuseModel(document.body, opts).start()
model.whenReady(() => {
  // debugging
  console.log('patches:', model.patches.length)
  const {world, patches, turtles, links} = model
  util.toWindow({ world, patches, turtles, links, model })
})
