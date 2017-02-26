// import util from './util.js'
import AgentSet from './AgentSet.js'

// Turtles are the world other agentsets live on. They create a coord system
// from Model's world values: size, minX, maxX, minY, maxY
class Turtles extends AgentSet {
  constructor (model, agentProto, name, baseSet = null) {
    super(model, agentProto, name, baseSet)
    // Skip if an basic Array ctor or a breedSet (don't rebuild patches!).
    // See AgentSet comments.
    if (typeof model === 'number' || this.isBreedSet()) return
    this.world = model.world
    this.labels = [] // sparse array for labels
  }
}

export default Turtles
