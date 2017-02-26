import Color from './Color.js'

// Flyweight object creation, see Patch/Patches.

// Class Turtle instances represent the dynamic, behavioral element of modeling.
// Each turtle knows the patch it is on, and interacts with that and other
// patches, as well as other turtles.

// The core variables needed by a Turtle. Modelers add additional "own variables"
// as needed.
const turtleVariables = { // Core variables for patches. Not 'own' variables.
  id: null,             // unique id, promoted by agentset's add() method
  defaults: null,       // pointer to defaults/proto object
  agentSet: null,       // my agentset/breed, set by ctor
  world: null,          // my agent/agentset's world
  patches: null,        // my patches/baseSet, set by ctor
  labelOffset: [0, 0],  // text pixel offset from the patch center
  labelColor: Color.newTypedColor(0, 0, 0) // the label color
}
class TurtleProto {
  // Initialize a Turtle given its Turtlees AgentSet.
  constructor (agentSet) {
    Object.assign(this, turtleVariables)
    this.defaults = this
    this.agentSet = agentSet
    this.world = agentSet.world
    this.turtles = agentSet.baseSet
  }

  // Breed get/set mathods and getter/setter versions.
  setBreed (breed) { breed.setBreed(this) }
  get breed () { return this.agentSet }
}

export default TurtleProto
