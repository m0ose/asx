import AgentArray from './AgentArray.js'
import util from './util.js'

// AgentSets are arrays that are factories for their own agents/objects.
// They are the base for Patches, Turtles and Links.

// Vocab: AgentSets are NetLogo collections: Patches, Turtles, and Links.
// Agent is an object in an AgentSet: Patch, Turtle, Link.

class AgentSet extends AgentArray {
  // Magic to return AgentArray's rather than AgentSets
  // Symbol.species: https://goo.gl/Zsxwxd
  static get [Symbol.species] () { return AgentArray }

  // Create an empty `AgentSet` and initialize the `ID` counter for add().
  // If baseSet is supplied, the new agentset is a subarray of baseSet.
  // This sub-array feature is how breeds are managed, see class `Model`
  constructor (model, AgentProto, name, baseSet = null) {
    // Because es6 JavaScript Array itself calls the Array ctor
    // (ex: slice() returning a new array), skip if not AgentSet ctor.
    if (model == null) model = 0 // model is null or undefined
    if (typeof model === 'number') {
      console.log('AgentSet ctor called for AgentArray/Array.')
      super(model) // model is a number, return AgentArray of that size
    } else {
      super() // create empty AgentArray
      baseSet = baseSet || this // if not a breed, set baseSet to this
      // AgentSets know their model, name, baseSet, world.
      Object.assign(this, {model, name, baseSet, world: model.world})
      // // Link our agents to us
      // this.agentProto.agentSet = this
      // BaseSets know their breeds and keep the ID global
      if (this.isBaseSet()) {
        this.breeds = {} // will contain breedname: breed entries
        this.ID = 0
      // Breeds add themselves to baseSet.
      } else {
        this.baseSet.breeds[name] = this
      }
      // Keep a list of this set's variables; see `own` below
      this.ownVariables = []
      // Create a proto for our agents by having a defaults and instance layer
      // this.AgentProto = AgentProto
      this.agentProto = new AgentProto(this)
      this.protoMixin()
    }
  }
  // All agents have:
  // vars: id, agentSet, model, world, breed (getter)
  //   baseSet by name: turtles/patches/links
  // methods: setBreed, getBreed, isBreed
  // getter/setter: breed
  protoMixin () {
    const agentProto = this.agentProto
    Object.assign(agentProto, {
      // defaults: agentProto,
      agentSet: this,
      model: this.model,
      world: this.world
      // this.turtles = agentSet.baseSet
    })
    agentProto[this.baseSet.name] = this.baseSet

    // const AgentProto = this.AgentProto
    const AgentProto = Object.getPrototypeOf(agentProto)
    // if (this.isBaseSet()) {
    if (!AgentProto.setBreed) {
      // const AgentProto = Object.getPrototypeOf(agentProto)
      // const AgentProto = this.AgentProto
      Object.assign(AgentProto, {
        setBreed (breed) { breed.setBreed(this) },
        getBreed () { return this.agentSet },
        isBreed (breed) { return this.agentSet === breed }
      })
      Object.defineProperty(AgentProto, 'breed', {
        get: function () { return this.agentSet }
      })
    }
  }

  // Is this a baseSet or a derived "breed"
  isBreedSet () { return this.baseSet !== this }
  isBaseSet () { return this.baseSet === this }

  // Abstract method used by subclasses to create and add their instances.
  create () { console.log(`AgentSet: Abstract method called: ${this}`) }

  // Add an agent to the list.  Only used by agentset factory methods. Adds
  // the `id` property to all agents. Increment `ID`.
  // Returns the object for chaining. The set will be sorted by `id`.
  addAgent (o) { // o only for breeds adding themselves to their baseSet
    o = o || Object.create(this.agentProto) // REMIND: Simplify! Too slick.
    if (this.isBreedSet())
      this.baseSet.addAgent(o)
    else
      o.id = this.ID++
    this.push(o)
    return o
  }
  clear () { while (this.any()) this.last().die() } // die() is an agent method
  // Remove an agent from the agentset, returning the agentset for chaining.
  // Note removeAgent(agent) different than remove(agent) which simply removes
  // the agent from it's array
  removeAgent (o) {
    // Remove me from my baseSet
    if (this.isBreedSet()) this.baseSet.remove(o, 'id')
    // Remove me from my set.
    this.remove(o, 'id')
    return this
  }

  // Get/Set default values for this agentset's agents.
  setDefault (name, value) { this.agentProto[name] = value }
  getDefault (name) { return this.agentProto[name] }
  // Declare variables of an agent class.
  // `varnames` is a string of space separated names
  own (varnames) {
    // if (this.isBreedSet())
    //   this.ownVariables = util.clone(this.baseSet.ownVariables)
    for (const name of varnames.split(' ')) {
      this.setDefault(name, null)
      this.ownVariables.push(name)
    }
  }

  // Move an agent from its AgentSet/breed to be in this AgentSet/breed.
  setBreed (a) { // change agent a to be in this breed
    // Return if `a` is already of my breed
    if (a.agentSet === this) return
    // Remove/insert breeds (not baseSets) from their agentsets
    if (a.agentSet.isBreedSet()) a.agentSet.remove(a, 'id')
    if (this.isBreedSet()) this.insert(a, 'id')

    // Make list of `a`'s vars and my ownvars.
    const avars = a.agentSet.ownVariables
    // First remove `a`'s vars not in my ownVariables
    for (const avar of avars)
      if (!this.ownVariables.includes(avar))
        delete a[avar]
    // Now add ownVariables to `a`'s vars, default to 0.
    // If ownvar already in avars, it is not modified.
    for (const ownvar of this.ownVariables)
      if (!avars.includes(ownvar))
        a[ownvar] = 0 // NOTE: NL uses 0, maybe we should use null?

    // Give `a` my defaults/statics
    return Object.setPrototypeOf(a, this.agentProto)
  }
}

export default AgentSet
