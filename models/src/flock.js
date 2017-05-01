// Import the lib/ mmodules via relative paths
import ColorMap from '../../src/ColorMap.js'
import Model from '../../src/Model.js'
import util from '../../src/util.js'

util.toWindow({ ColorMap, Model, util })

class FlockModel extends Model {
  setVision (vision) {
    this.vision = vision
    // this.patches.cacheRect(vision, true)
  }
  setMaxTurn (maxTurnDegrees) {
    this.maxTurn = util.radians(maxTurnDegrees)
  }
  setup () {
    // this.turtles.own('vision')

    this.turtles.setDefault('wrap', true)
    this.turtles.setDefault('z', 0.1)
    this.turtles.setDefault('size', 1.5)
    this.turtles.setDefault('speed', 0.25)

    const cmap = ColorMap.grayColorMap(0, 100)
    for (const p of this.patches) p.setColor(cmap.randomColor())

    this.refreshPatches = false
    this.setMaxTurn(3.0)
    this.setVision(3)
    this.minSeparation = 0.75
    // this.anim.setRate(30)
    this.population = 1e4 / 2 // this.patches.length // 300

    // Remind: Fewer turtles than patches.
    // for (const p of this.patches.nOf(this.population))
    //   p.sprout(1)
    // util.repeat(this.population, () => {
    //
    // })
    this.turtles.create(this.population)

    // this.turtles.create(numTurtles, (t) => {
    //   t.size = util.randomFloat2(0.2, 0.5) // + Math.random()
    //   t.speed = util.randomFloat2(0.01, 0.05) // 0.5 + Math.random()
    // })
  }
  step () {
    util.forEach(this.turtles, (t) => {
      t.theta += util.randomCentered(0.1)
      // t.forward(this.speed)
      t.forward(t.speed)
    })
    // for (const t of this.turtles) this.flock(t)
  }
  flock (a) { // a is turtle
    // flockmates = this.turtles.inRadius(a, this.vision).other(a)
    const flockmates = this.turtles.inRadius(a, this.vision, false)
    // flockmates = a.inRadius(this.turtles, this.vision, false)
    if (flockmates.length !== 0) {
      // REMIND: distanceSq or manhattan distance
      const nearest = flockmates.minOneOf((f) => f.distance(a))
      if (a.distance(nearest) < this.minSeparation) {
        this.separate(a, nearest)
      } else {
        this.align(a, flockmates)
        this.cohere(a, flockmates)
      }
    }
    a.forward(a.speed)
  }
  separate (a, nearest) {}
  align (a, flockmates) {}
  cohere (a, flockmates) {}

}

const model = new FlockModel(document.body).start()
model.whenReady(() => {
  console.log('patches:', model.patches.length)
  console.log('turtles:', model.turtles.length)

  // debugging
  const {world, patches, turtles} = model
  util.toWindow({ world, patches, turtles, model })
})
