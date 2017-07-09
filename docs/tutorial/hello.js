import {ColorMap, Model, util} from 'http://backspaces.github.io/asx/dist/AS.module.js'

class Hello extends Model {
  setup () {
    this.patches.ask(p => {
      p.color = ColorMap.LightGray.randomColor()
    })

    this.turtles.setDefault('atEdge', 'bounce')
    this.turtles.create(10, t => {
      const patch = this.patches.oneOf()
      t.setxy(patch.x, patch.y)
    })
  }
  step () {
    this.turtles.ask(t => {
      t.direction += util.randomCentered(0.1)
      t.forward(0.1)
    })
  }
}

const model = new Hello()
model.start()
util.toWindow({ ColorMap, Model, util, model })
