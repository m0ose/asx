# AgentSet.js

AgentSets are subclasses of [AgentArray](AgentArray.md) that are factories for their own agents/objects. Thus the Foos subclass of AgentSet will create all of its own Foo elements.

AgentSet is the superclass for Patches, Turtles and Links which contain Patch, Turtle, and Link agents. You will primarily work with these subclasses, not directly with AgentSet.

AgentSets can have sub-arrays called `breeds`. Thus Turtles could have `person` and `car` breeds.

Breeds can have their own default values which differ from their baseSet. So Turtles have properties like `size`, `color` and `shape`. Any Turtle breed can have their own, different, default for these. See [this article](https://medium.com/dailyjs/two-headed-es6-classes-fe369c50b24) for a detailed discussion.

## Statics

> `static get [Symbol.species] () { return AgentArray }`

This is magic to have AgentSet iterators return AgentArray's rather than AgentSets. See the `Symbol.species` [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species).

Thus any AgentSet with iterators will return AgentArrays rather than instances of the AgentSet. Unbelievably useful!

## Constructor

> `constructor (model, AgentProto, name, baseSet = null)`

* model: Class Model integrates all AgentSet Modules into a single [Agent Based Model](https://en.wikipedia.org/wiki/Agent-based_model) (ABM). There can be multiple models in a page.
* AgentProto: an instance of the Agent class managed by this AgentSet. It is this that is used by the factory method creating Agents for this AgentSet.
* name: a string used to identify the AgentSet: patches, turtles, links. Breeds also are named: buildings, parks (patches breeds); people, cars (turtle breeds); and streets, rivers (links).
* baseSet: Only used by breeds to identify which AgentSet they are a sub-array of.

## Statics

> `static get [Symbol.species] () { return AgentArray }`

This is magic to have AgentSet iterators return AgentArray's rather than AgentSets. See the `Symbol.species` [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species).

Thus any AgentSet with iterators will return AgentArrays rather than instances of the AgentSet. Unbelievably useful!

## Methods

> `protoMixin()`

Used by the constructor to add several variables to the AgentProto. Not used elsewhere.

> `isBaseSet ()` <br />
> `isBreedSet ()`

Is this a baseSet (Turtles) or a derived breed (People)

> `create ()`

Abstract factory method used by AgentSet subclasses to create and add their Agents to their AgentArray.

> `addAgent (agent)`

Used by `create` to add an agent to itself. Adds an ID property

> `removeAgent (agent)`

Remove an agent from this AgentSet, returning the AgentSet for chaining. If the AgentSet is a breed, removes agent from both the BaseSet and BreedSet.

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

None

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/AgentSet.js).
