import util from './util.js'
import Color from './Color.js'

// Flyweight object creation, see Patch/Patches.

// Class Link instances form a link between two turtles, forming a graph.

// The core default variables needed by a Link.
// Use links.setDefault(name, val) to change
// Modelers add additional "own variables" as needed.
// const linkVariables = { // Core variables for patches. Not 'own' variables.
//   // id: null,             // unique id, promoted by agentset's add() method
//   // defaults: null,       // pointer to defaults/proto object
//   // agentSet: null,       // my agentset/breed
//   // model: null,      // my model
//   // world: null,          // my agent/agentset's world
//   // links: null,          // my baseSet
//
//   end0: 0,              // Turtles: end0 & 1 are turtle ends of the link
//   end1: 0,
//   color: Color.toColor('yellow'), // Note: links must have A = 255, opaque.
//   // z: 1, // possibly a z offset from the turtles?
//
//   // Line width. In Three.js/webgl this is always 1. See
//   // [Drawing Lines is Hard!](https://mattdesl.svbtle.com/drawing-lines-is-hard)
//   width: 1
// }
class Link {
  static defaultVariables () { // Core variables for patches. Not 'own' variables.
    return {
      // id: null,             // unique id, promoted by agentset's add() method
      // defaults: null,       // pointer to defaults/proto object
      // agentSet: null,       // my agentset/breed
      // model: null,      // my model
      // world: null,          // my agent/agentset's world
      // links: null,          // my baseSet

      end0: null,              // Turtles: end0 & 1 are turtle ends of the link
      end1: null,
      color: Color.toColor('yellow'), // Note: links must have A = 255, opaque.
      // z: 1, // possibly a z offset from the turtles?

      // Line width. In Three.js/webgl this is always 1. See
      // [Drawing Lines is Hard!](https://mattdesl.svbtle.com/drawing-lines-is-hard)
      width: 1
    }
  }
  // Initialize a Link
  constructor () {
    Object.assign(this, Link.defaultVariables())
  }
  init (from, to) {
    this.end0 = from
    this.end1 = to
    from.links.push(this)
    to.links.push(this)
  }
  // Remove this link from its agentset
  die () {
    this.agentSet.removeAgent(this)
    util.removeItem(this.end0.links, this)
    util.removeItem(this.end1.links, this)
  }

  bothEnds () { return [this.end0, this.end1] }
  length () { return this.end0.distance(this.end1) }
  otherEnd (turtle) {
    if (turtle === this.end0) return this.end1
    if (turtle === this.end1) return this.end0
    throw Error(`Link.otherEnd: turtle not a link turtle: ${turtle}`)
  }

  // Breed get/set mathods.
  // setBreed (breed) { breed.setBreed(this) }
  // get breed () { return this.agentSet }
}

export default Link
