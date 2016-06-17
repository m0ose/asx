// import AgentSet from './AgentSet.js'
import Color from './Color.js'
// import util from './util.js'

// const PatchVariables = {
//   id: null,         // unique id, set by agentset's add() method
//   breed: null,      // set by the agentset constructor owning me
//   neighbors: null,  // 8 patches surrounding me
//   neighbors4: null, // 4 patches north, east, south, west of me
//   pRect: null,      // Performance: cached rect of larger neighborhoods
//   label: null,      // text for this patch, if any
//   labelOffset: [0, 0],  // text offset from the patch center
//   color: Color.typedColor(0, 0, 0),     // the patch color
//   labelColor: Color.typedColor(0, 0, 0) // the label color
// }
const PatchProto = {
  init (breed) {
    const defaults = this.baseVariables()
    defaults.breed = breed
    defaults.world = breed.world
    Object.setPrototypeOf(defaults, this)
    // Object.assign(defaults, breed.model.world)
    return defaults
  },
  baseVariables () { // Core variables for patches. Not 'own' variables.
    return {
      id: null,         // unique id, set by agentset's add() method
      breed: null,      // set by the agentset constructor owning me
      neighbors: null,  // 8 patches surrounding me
      neighbors4: null, // 4 patches north, east, south, west of me
      pRect: null,      // Performance: cached rect of larger neighborhoods
      label: null,      // text for this patch, if any
      labelOffset: [0, 0],  // text offset from the patch center
      color: Color.typedColor(0, 0, 0),     // the patch color
      labelColor: Color.typedColor(0, 0, 0) // the label color
    }
  },
  get x () {
    // const {numX, minX} = this.world
    return (this.id % this.world.numX) + this.world.minX
  },
  get y () {
    // const {numX, maxY} = this.breed.world
    return this.world.maxY - Math.floor(this.id / this.world.numX)
  },
  setColor (typedColor) {
    this.breed.pixels.data32[this.id] = typedColor.getPixel()
  }
}
export default PatchProto
