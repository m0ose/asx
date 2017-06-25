// import ColorMap from '../../dist/AS/ColorMap.js'
// import DataSet from '../../dist/AS/DataSet.js'
// import Model from '../../dist/AS/Model.js'
// import util from '../../dist/AS/util.js'
const {ColorMap, DataSet, Model, util} = AS

util.toWindow({ ColorMap, DataSet, Model, util })

class DiffuseModel extends Model {
  setup () {
    this.patches.own('ran ds')
    this.turtles.setDefault('speed', 0.5)
    this.turtles.setDefault('atEdge', 'wrap')
    this.population = 1
    this.radius = 6

    // this.cmap = ColorMap.Jet
    this.cmap = ColorMap.Rgb256
    // REMIND: Three mouse picking: this.mouse = new Mouse(this, true).start()
    this.patches.ask(p => {
      p.ran = util.randomFloat(1.0)
      p.ds = 0
    })

    this.patches.nOf(this.population).ask(p => {
      p.sprout(1, this.turtles, t => {
        t.setSize(5)
      })
    })
  }
  step () {
    this.turtles.ask((t) => {
      t.theta += util.randomCentered(0.1)
      t.forward(t.speed)
      t.patch.inRadius(this.radius, true).ask(p => {
        p.ran = Math.min(p.ran + 0.1, 0.6)
      })
    })

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
  console.log('turtles:', model.turtles.length)
  const {world, patches, turtles, links} = model
  util.toWindow({ world, patches, turtles, links, model })
})
