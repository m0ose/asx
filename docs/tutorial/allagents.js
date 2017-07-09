import {ColorMap, Model, util} from '../../dist/AS.module.js'
util.toWindow({ ColorMap, Model, util })

class LinksModel extends Model {
  setup () {
    this.patches.ask(p => {
      p.color = ColorMap.DarkGray.randomColor()
    })

    this.turtles.setDefault('shape', 'circle')
    this.turtles.create(50, (t) => {
      t.color = ColorMap.Rgb256.randomColor()
    })
    this.turtles.layoutCircle(8)

    util.repeat(100, (i, a) => {
      const turtles = this.turtles.nOf(2)
      this.links.create(turtles[0], turtles[1], (link) => {
        link.color = ColorMap.Basic16.randomColor()
        // link.color = ColorMap.Rgb256.randomColor()
      })
    })
  }
  step () {
    // REMIND: Three mouse picking
    // this.turtles.ask((t) => {
    //   t.theta += util.randomCentered(0.1)
    //   t.forward(t.speed)
    // })
  }
}
const options = Model.defaultOptions(13, 10)
const model = new LinksModel(document.body, options).start()
model.whenReady(() => {
  // debugging
  console.log('patches:', model.patches.length)
  console.log('turtles:', model.turtles.length)
  console.log('links:', model.links.length)
  const {world, patches, turtles, links} = model
  util.toWindow({ world, patches, turtles, links, model })
})
