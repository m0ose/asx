import util from './util.js'
// import Color from './Color.js'
// import ColorMap from './ColorMap.js'
// import SpriteSheet from './SpriteSheet'

// Flyweight object creation, see Patch/Patches.

// Class Turtle instances represent the dynamic, behavioral element of modeling.
// Each turtle knows the patch it is on, and interacts with that and other
// patches, as well as other turtles.

// The core default variables needed by a Turtle.
// Use turtles.setDefault(name, val) to change
// Modelers add additional "own variables" as needed.
const turtleVariables = { // Core variables for patches. Not 'own' variables.
  id: null,             // unique id, promoted by agentset's add() method
  defaults: null,       // pointer to defaults/proto object
  agentSet: null,       // my agentset/breed
  world: null,          // my agent/agentset's world
  turtles: null,        // my baseSet

  x: 0,                 // x, y, z in patchSize units.
  y: 0,                 // Use turtles.setDefault('z', num) to change default height
  z: 1,
  wrap: false,          // Clamp or Wrap turtles to world if wander off world.

  theta: 0,
  sprite: null,
  size: 1 // size in patches, default to one patch
  // spriteFcn: 'default',
  // spriteColor: Color.newTypedColor(255, 0, 0),

  // labelOffset: [0, 0],  // text pixel offset from the turtle center
  // labelColor: Color.newTypedColor(0, 0, 0) // the label color
}
class TurtleProto {
  // Initialize a Turtle given its Turtles AgentSet.
  constructor (agentSet) {
    Object.assign(this, turtleVariables)
    this.defaults = this
    this.agentSet = agentSet
    this.world = agentSet.world
    this.turtles = agentSet.baseSet

    // this.sprite = this.turtles.model.spriteSheet.addDrawing('default')
    // this.sprite = this.turtles.spriteSheet.add('default', 'red')
  }
  // Create my shape via src: sprite, fcn, string, or image/canvas
  setSprite (src, color = 'red', strokeColor = 'black') {
    if (src.sheet) { this.sprite = src; return } // src is a sprite
    const ss = this.turtles.model.spriteSheet
    this.sprite = util.isImageable(src)
      ? ss.addImage(src)
      : ss.addDrawing(src, color, strokeColor)
  }
  // setSize (size) { this.size = size * this.world.patchSize }

  // Return true if x, y within patch boundaries
  // isOnWorld (x, y) {
  //   const {minXcor, maxXcor, minYcor, maxYcor} = this.world
  //   return util.between(x, minXcor, maxXcor) && util.between(y, minYcor, maxYcor)
  // }
  // Set x, y position. If z given, override default z.
  setXY (x, y, z = null) {
    if (z) this.z = z
    if (this.world.isOnWorld(x, y)) {
      this.x = x
      this.y = y
    } else {
      const {minXcor, maxXcor, minYcor, maxYcor} = this.world
      if (this.wrap) {
        this.x = util.wrap(x, minXcor, maxXcor)
        this.y = util.wrap(y, minYcor, maxYcor)
      } else {
        util.clamp(x, minXcor, maxXcor)
        util.clamp(y, minYcor, maxYcor)
      }
    }
  }
  forward (d) {
    this.setXY(this.x + d * Math.cos(this.theta), this.y + d * Math.sin(this.theta))
  }

  // setDrawSprite (fcn, color, color2) {
  //   this.sprite = this.model.spriteSheet.addDrawing(fcn, color)
  // }

  // Breed get/set mathods.
  setBreed (breed) { breed.setBreed(this) }
  get breed () { return this.agentSet }
}

export default TurtleProto
