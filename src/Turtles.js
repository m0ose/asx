import util from './util.js'
import AgentSet from './AgentSet.js'
// import SpriteSheet from './SpriteSheet.js'
import ColorMap from './ColorMap.js'

// Turtles are the world other agentsets live on. They create a coord system
// from Model's world values: size, minX, maxX, minY, maxY
class Turtles extends AgentSet {
  constructor (model, AgentProto, name, baseSet = null) {
    // AgentSet sets these variables:
    // model, name, baseSet, world: model.world & agentProto: new AgentProto
    super(model, AgentProto, name, baseSet)
    // Skip if an basic Array ctor or a breedSet. See AgentSet comments.
    if (typeof model === 'number' || this.isBreedSet()) return
    // this.world = model.world
    this.labels = [] // sparse array for labels
    // this.spriteSheet = new SpriteSheet()
    // this.colorMap = ColorMap.Basic16
  }
  create (num = 1, initFcn = (turtle) => {}) {
    const array = util.repeat(num, (i, a) => {
      const turtle = this.add()
      turtle.theta = util.randomFloat(Math.PI * 2)
      initFcn(turtle)
      if (!turtle.sprite)
        turtle.setSprite('default', ColorMap.Basic16.randomColor().css)
      a.push(turtle)
    })
    return array
  }
}

export default Turtles
