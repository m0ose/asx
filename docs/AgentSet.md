# AgentSet.js

AgentSets are subclasses of [AgentArray](AgentArray.md) that are factories for their own agents/objects. Thus the Foos subclass of AgentSet will create all of its own Foo elements.

AgentSet is the superclass for Patches, Turtles and Links. They contain Patch, Turtle, and Link Agents. The AgentSet will call the Agent constructor for you.

AgentSets can have sub-arrays called `breeds`. Thus the Turtles instance could have `person` and `car` breeds.

Breeds can have their own default values which differ from their baseSet. So Turtles have properties like `size`, `color` and `shape`. Any Turtle breed can have their own, different, default for these, their own color default. See [this article](https://medium.com/dailyjs/two-headed-es6-classes-fe369c50b24) for a detailed discussion.

## Statics

> `static get [Symbol.species] () { return AgentArray }`

This is magic to have AgentSet iterators return AgentArray's rather than AgentSets. See the `Symbol.species` [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species).

Thus any AgentSet with iterators will return AgentArrays rather than instances of the AgentSet. Unbelievably useful!

## Constructor

> `constructor (model, AgentClass, name, baseSet = null)`

* model: Class Model integrates all AgentSet Modules into a single [Agent Based Model](https://en.wikipedia.org/wiki/Agent-based_model) (ABM). There can be multiple models in a page.
* AgentClass: the Agent class managed by this AgentSet. It is this that is used by the factory method creating Agents for this AgentSet.
* name: a string used to identify the AgentSet: patches, turtles, links. Breeds also are named: buildings, parks (patches breeds); people, cars (turtle breeds); and streets, rivers (links).
* baseSet: Only used by breeds to identify which AgentSet they are a sub-array of. Managed for you by `newBreed` method below.

## Subclass Methods

These methods are primarily "private", used by subclasses.

> `protoMixin()`

Used by the constructor to add several variables to the AgentClass. Not used elsewhere.

> `newBreed (name)`

Create a breed/subarray of this AgentSet. Example: create a people breed of turtles:
`const people = turtles.newBreed('people')`
This is called for you by class Model's three built-ins:
`patchBreeds, turtleBreeds, linkBreeds`


> `isBaseSet ()` <br />
> `isBreedSet ()`

Is this a baseSet (Turtles) or a derived breed (People)

> `create ()`

Abstract factory method used by AgentSet subclasses to create and add their Agents to their AgentArray.

> `addAgent (agent)`

Used by `create` to add an agent to itself. Adds an ID property

> `removeAgent (agent)`

Remove an agent from this AgentSet, returning the AgentSet for chaining.

If the AgentSet is a breed, removes agent from both the BaseSet and BreedSet. Removing a people agent will also remove it from the turtles AgentSet.

## Methods

These methods are inherited by subclasses for general use.

> `clear ()`

Asks each agent in the AgentSet to remove itself. This allows the agent to call removeAgent(agent), and also perform additional tasks it needs to do. Uses agent.die() common method.

> `randomColor ()`

AgentSets often need a random color. We use a standard shared ColorMap map for this.

> `setDefault (name, value)` <br />
> `getDefault (name)`

Set/Get default values for this AgentSet's agents.

> `own (varnames)`

Declare variables for an AgentSet's agents, where `varnames` is a string of space separated names. This is mainly used for `setBreed` and may not be needed in the future.

> `setBreed (agent)`

Move an agent from its AgentSet/BreedSet to be in this AgentSet/BreedSet.

## Properties

BaseSet properties:
* `ID`: A unique integer given to each new agent. ID incremented each use.
* `breeds`: An array of this baseSet's breeds.

General properties:
* `model`, `AgentClass`, `name`, `baseSet`: Constructor arguments
* `agentProto`: a singleton instance of AgentClass. The "defaults" layer.
* `ownVariables`: The variables declared by the `own` method

## AgentClass mixin

The protoMixin() method mixes these into the AgentClass & agentProto instance:

The AgentClass:
* `setBreed (breed)`: Convert this agent to belong to the breed agentSet
* `getBreed ()`: Get the breed/agentSet for this agent
* `isBreed (breed)`: Return true if this agent is a member of the given breed
* `getter breed`: alias for agent.breed === agent.getBreed()

The agentProto singleton instance of AgentClass:
* `agentSet`: `this`, the agentSet creating the agent,
* `<name>`: this.baseSet. `<name>` is one of patches, turtles, links

Added by addAgent(agent):
* `id`: Set to the baseSet ID++

This is the idea behind "agentsets are factories for their agents".

Indeed, all agent constructors are the same. For Patch it looks like:
```
constructor () {
  Object.assign(this, Patch.variables())
}
```
Where `Patch.variables()` is a static method returning an object containing the patch's default variables.


## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/AgentSet.js).
