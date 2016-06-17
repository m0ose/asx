System.register(['./util.js'], function (_export, _context) {
  "use strict";

  var util;
  return {
    setters: [function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {

      // AgentSets are arrays that are factories for their agents/objects.
      // They are the base for Patches, Turtles and Links.

      // Vocab: AgentSets are NetLogo collections: Patches, Turtles, and Links
      // Agent is an object in an AgentSet: Patch, Turtle, Link.

      class AgentSet extends Array {
        // AgentSet "class method": Convert an array to an agentset.
        // This is not the constructor for an AgentSet but gives the array
        // the prototype of AgentSet, thus is somewhat incomplete.
        // See asSet() method below.
        static AsSet(array, Set = AgentSet) {
          return Object.setPrototypeOf(array, Set.prototype);
        }

        // Create an empty `AgentSet` and initialize the `ID` counter for add().
        // If baseSet is supplied, the new agentset is a subarray of baseSet.
        // This sub-array feature is how breeds are managed, see class `Model`
        constructor(model, agentProto, name, baseSet = null) {
          console.log('AgentSet ctor', arguments);
          // Because JS itself calls the Array ctor, skip if not AgentSet ctor.
          if (typeof model === 'number') {
            super(model); // model is a number, return Array of that size
          } else {
              super(0);
              Object.assign(this, { model, name, baseSet });
              this.agentProto = agentProto.init(this);
              // // Each agent will know its breed, and breed.model:
              // this.defaults = {breed: this}
              // Object.setPrototypeOf(this.defaults, agentProto)
              // Non-breed mainSets know their "children" and keep the ID global
              if (this.isBaseSet()) {
                // this.breeds = [] // maybe obj w name: this
                this.breeds = {}; // maybe obj w name: this
                this.ID = 0;
              } else {
                // this.baseSet.breeds.push(this)
                this.baseSet.breeds[name] = this;
              }
              // Keep a list of this set's variables
              this.ownVariables = ['id'];
            }
        }

        // Is this a baseSet or a derived "breed"
        isBreedSet() {
          return this.baseSet !== null;
        }
        isBaseSet() {
          return this.baseSet === null;
        }

        // Abstract method used by subclasses to create and add their instances.
        create() {}
        // Add an agent to the list.  Only used by agentset factory methods. Adds
        // the `id` property to all agents. Increment `ID`.
        // Returns the object for chaining. The set will be sorted by `id`.
        add(o) {
          // Object.setPrototypeOf(Object.getPrototypeOf(o), this.defaults)
          if (this.isBreedSet()) this.baseSet.add(o);else o.id = this.ID++;
          // Object.setPrototypeOf(o, this.defaults)
          // this.ownVariables.forEach((v) => {
          //   if (o[v] === undefined) { o[v] = null }
          // })
          this.push(o);
          return o;
        }
        // Remove an agent from the agentset, returning the agentset.
        // This does not change ID, an agentset can have gaps in terms of their ids.
        // Assumes set is sorted by `id`.
        remove(o) {
          // Remove me from my baseSet
          if (this.isBreedSet()) util.removeItem(this.baseSet, o, 'id');
          // Remove me from my set.
          util.removeItem(this, o, 'id');
          return this;
        }

        // Get/Set default values for this agentset's agents.
        setDefault(name, value) {
          this.agentProto[name] = value;
        }
        getDefault(name) {
          this.agentProto[name];
        }
        // Declare variables of an agent class.
        // Vars = a string of space separated names
        own(vars) {
          if (this.isBreedSet()) this.ownVariables = util.clone(this.baseSet.ownVariables);
          for (const name of vars.split(' ')) {
            this.ownVariables.push(name);
          }
        }

        // Move an agent from its AgentSet/breed to be in this AgentSet/breed.
        // REMIND: match NetLogo sematics in terms of own variables.
        setBreed(a) {
          // change agent a to be in this breed
          // Remove/insert breeds (not mainSets) from their agentsets
          if (a.breed.isBreedSet()) util.removeItem(a.breed, a, 'id');
          if (this.isBreedSet()) util.insertItem(this, a, 'id');
          // Make list of a's vars and my ownvars.
          const avars = Object.keys(a);
          // First remove a's vars not in my ownVariables
          for (const avar of avars) if (!this.ownVariables.includes(avar)) delete a[avar];
          // Now add ownVariables to a's vars, default to 0.
          // If ownvar already in avars, it is not modified.
          for (const ownvar of this.ownVariables) if (!avars.includes(ownvar)) a[ownvar] = 0; // NOTE: NL uses 0, maybe we should use null?

          // Finally give a my defaults

          // Object.setPrototypeOf(a, this.agentClass.prototype)
          // delete a[k] for own k,v of a when proto[k]?
          return a;
        }

        // Method to convert an array to the same AgentSet type as this's.
        // Always called with "this": `this.asSet(array)`. Mainly used when
        // an AgentSet method calls this.someArrayMethod which returns a new array.
        asSet(array) {
          return Object.setPrototypeOf(array, Object.getPrototypeOf(this));
        }

        // ### General Array of Objects methods, could be its own MixIn

        // Return true if there are no items in this set, false if not empty.
        empty() {
          return this.length === 0;
        }
        // Return !empty()
        any() {
          return this.length !== 0;
        }
        // Return last item in this array. Returns undefined if empty.
        last() {
          return this[this.length - 1];
        }
        // Return true if reporter true for all of this set's objects
        all(reporter) {
          return this.every(reporter);
        }
        // Return property values for key from this array's objects
        props(key) {
          return this.map(a => a[key]);
        }

        // Return shallow copy of a protion of this agentset
        // [See Array.slice](https://goo.gl/Ilgsok)
        // Default is to clone entire agentset
        clone(begin = 0, end = this.length) {
          return this.slice(begin, end); // Wow, returns an agentset rather than Array!
          // return this.asSet(this.slice(begin, end))
        }
        // Return this agentset sorted by the reporter in ascending/descending order.
        // If reporter is a string, convert to a fcn returning that property.
        // Use clone if you don't want to mutate this array.
        sortBy(reporter, ascending = true) {
          util.sortObjs(this, reporter, ascending);
          return this;
        }

        // Return a random agent. Return undefined if empty.
        oneOf() {
          return this[util.randomInt(this.length)];
        }
        // Return the first agent having the min/max of given value of f(agent).
        // If reporter is a string, convert to a fcn returning that property
        minOrMaxOf(min, reporter) {
          if (this.empty()) util.error('min/max OneOf: empty array');
          if (typeof reporter === 'string') reporter = util.propFcn(reporter);
          let o = null;
          let val = min ? Infinity : -Infinity;
          for (let i = 0; i < this.length; i++) {
            const a = this[i];
            const aval = reporter(a);
            if (min && aval < val || !min && aval > val) [o, val] = [a, aval];
          }
          return o;
        }
        // The min version of the above
        minOneOf(reporter) {
          return this.minOrMaxOf(true, reporter);
        }
        // The max version of the above
        maxOneOf(reporter) {
          return this.minOrMaxOf(false, reporter);
        }

        // Return n random agents.
        // See [Fisher-Yates-Knuth shuffle](https://goo.gl/fWNFf)
        // for better approach for large n.
        nOf(n) {
          // I realize this is a bit silly, lets hope random doesn't repeat!
          if (n > this.length) util.error('nOf: n larger than agentset');
          if (n === this.length) return this;
          const result = [];
          while (result.length < n) {
            const o = this.oneOf();
            if (!(o in result)) result.push(o);
          }
          return this.asSet(result);
        }
        // Return a new agentset of the n min/max agents of the value of reporter,
        // in ascending order.
        // If reporter is a string, convert to a fcn returning that property
        // NOTE:we do not manage ties, see NetLogo docs.
        minOrMaxNOf(min, n, reporter) {
          if (n > this.length) util.error('min/max nOf: n larger than agentset');
          const as = this.clone().sortBy(reporter);
          return min ? as.clone(0, n) : as.clone(as.length - n);
        }
        minNOf(n, reporter) {
          return this.minOrMaxNOf(true, n, reporter);
        }
        maxNOf(n, reporter) {
          return this.minOrMaxNOf(false, n, reporter);
        }

      }
      // Object.setPrototypeOf(AgentSet, Array.prototype)

      _export('default', AgentSet);
    }
  };
});