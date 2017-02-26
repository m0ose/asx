import Color from './Color.js'

// Class Patch instances represent a rectangle on a grid.  They hold variables
// that are in the patches the turtles live on.  The set of all patches
// is the world on which the turtles live and the model runs.

// The core variables needed by a Patch. Modelers add additional "own variables"
// as needed. Surprisingly `label` and `color` are not here, they are managed
// optimally by the Patches AgentSet. Similarly `x` & `y` are derived from id.
// The neighbors and neighbors4 variables are initially getters that
// are "promoted" to instance variables if used.
const patchVariables = { // Core variables for patches. Not 'own' variables.
  id: null,             // unique id, promoted by agentset's add() method
  defaults: null,       // pointer to defaults/proto object
  agentSet: null,       // my agentset/breed, set by ctor
  world: null,          // my agent/agentset's world
  patches: null,        // my patches/baseSet, set by ctor
  labelOffset: [0, 0],  // text pixel offset from the patch center
  labelColor: Color.newTypedColor(0, 0, 0) // the label color
  // Derived variables: label, color, x, y, neighbors, neighbors4
}

// Flyweight object creation:
// Objects within AgentSets use "prototypal inheritance" via Object.create().
// Here, the PatchProto class is given to Patches for use creating Proto objects
// (new PatchProto(agentSet)), but only once per model/breed.
// The flyweight Patch objects are created via Object.create(protoObject),
// This lets the new PatchProto(agentset) obhect be "defaults".
class PatchProto {
  // Initialize a Patch given its Patches AgentSet.
  constructor (agentSet) {
    Object.assign(this, patchVariables)
    this.defaults = this
    this.agentSet = agentSet
    this.world = agentSet.world
    this.patches = agentSet.baseSet
  }

  // Getter for x,y derived from patch id, thus no setter.
  get x () {
    return (this.id % this.world.numX) + this.world.minX
  }
  get y () {
    return this.world.maxY - Math.floor(this.id / this.world.numX)
  }

  // Getter for neighbors of this patch.
  // Uses lazy evaluation to promote neighbors to instance variables.
  // To avoid promotion, use `patches.neighbors(this)`.
  // Promotion makes getters not needed.
  get neighbors () { // lazy promote neighbors from getter to instance prop.
    const n = this.patches.neighbors(this)
    Object.defineProperty(this, 'neighbors', {value: n, enumerable: true})
    return n
  }
  get neighbors4 () {
    const n = this.patches.neighbors4(this)
    Object.defineProperty(this, 'neighbors4', {value: n, enumerable: true})
    return n
  }

  // Manage colors by directly setting pixels in Patches pixels object.
  // With getter/setters, slight performance hit.
  setColor (typedColor) {
    this.patches.pixels.data[this.id] = typedColor.getPixel()
  }
  // Optimization: If shared color provided, sharedColor is modified and
  // returned. Otherwise new color returned.
  getColor (sharedColor = null) {
    const pixel = this.patches.pixels.data[this.id]
    if (sharedColor) {
      sharedColor.pixel = pixel
      return sharedColor
    }
    return Color.toTypedColor(pixel)
  }
  get color () { return this.getColor() }
  set color (typedColor) { return this.setColor(typedColor) }

  // Set label. Erase label via setting to undefined.
  setLabel (label) {
    this.patches.setLabel(this, label)
  }
  getLabel () {
    this.patches.getLabel(this)
  }
  get label () { return this.getLabel() }
  set label (label) { return this.setColor(label) }

  // Return patch dx, dy from my position. Return undefined if off-world.
  patchAt (dx, dy) {
    return this.patches.patch(this.x + dx, this.y + dy)
  }

  // Breed get/set mathods and getter/setter versions.
  setBreed (breed) { breed.setBreed(this) }
  get breed () { return this.agentSet }
}

export default PatchProto
