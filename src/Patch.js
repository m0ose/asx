import Color from './Color.js'

// Objects within AgentSets use "prototypal inheritance".
// The PatchProto is given to Patches for use creating Patch objects.
const PatchProto = {
  // Initialize a Patch given its Patches AgentSet.
  init (agentSet) {
    const defaults = this.baseVariables()
    defaults.world = agentSet.world
    defaults.patches = agentSet.baseSet
    Object.setPrototypeOf(defaults, this)
    return defaults
  },
  // Return an object that will initially be the "default" variables
  // layer in a patch prototype stack.
  baseVariables () { // Core variables for patches. Not 'own' variables.
    return {
      id: null,           // unique id, set by agentset's add() method
      agentSet: null,     // my agentset/breed, set by AgentSet ctor
      patches: null,      // my patches/baseSet, set by init()
      labelOffset: [0, 0],  // text pixel offset from the patch center
      labelColor: Color.typedColor(0, 0, 0) // the label color
      // label: null,        // text for this patch, if any
      // color: Color.typedColor(0, 0, 0)       // the patch color
    }
  },

  // Getter for x,y derived from patch id, thus no setter.
  get x () {
    return (this.id % this.world.numX) + this.world.minX
  },
  get y () {
    return this.world.maxY - Math.floor(this.id / this.world.numX)
  },

  // Getter for neighbors of this patch.
  // Uses lazy evaluation to promote neighbors to instance variables.
  // To avoid promotion, use `patches.neighbors(this)`
  get neighbors () { // lazy promote neighbors from getter to instance prop.
    const n = this.patches.neighbors(this)
    Object.defineProperty(this, 'neighbors', {value: n, enumerable: true})
    return n
  },
  get neighbors4 () {
    const n = this.patches.neighbors4(this)
    Object.defineProperty(this, 'neighbors4', {value: n, enumerable: true})
    return n
  },

  // Manage colors by directly setting pixels in Patches pixels object
  setColor (typedColor) {
    this.patches.pixels.data32[this.id] = typedColor.getPixel()
  },
  getColor (typedColor) {
    return this.patches.pixels.data32[this.id]
  },

  // Set label. Erase label via setting to undefined.
  setLabel (label) {
    this.patches.setLabel(this, label)
  },

  // Return patch dx, dy from my position. Return undefined if off-world.
  patchAt (dx, dy) {
    return this.patches.patch(this.x + dx, this.y + dy)
  }
}
export default PatchProto
