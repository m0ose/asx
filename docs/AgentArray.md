# AgentArray.js

AgentArray is a subclass of Array which contains Objects, generally called Agents. Thus the patches array contains patch objects, etc for turtles and links. The words `agent` and `object` are interchangeable.

Because Agents contain common values such as `id`, `x,y,z`, and so on, a few methods assume these values are present.

Note the term `reporter` below means a function that returns a value. Similarly, we use NetLogo method names which have JavaScript Array equivalents.

## Statics

> `static fromArray (array)`

A static method to convert an Array to an AgentArray. Called like this: `AgentArray.fromArray(array)`

Note that the Array.isArray static: `Array.isArray(patches)` returns `true`

## Constructor

None. It inherits Array's constructor.

## Methods

> `toArray ()`

Convert this AgentArray to an Array in place. Return `this` for chaining.

> `remove (agent, prop)` <br />
> `insert (agent, prop)`

Remove/insert and agent from/to the array. If prop given, assume array sorted by that property, using binary search for performance. Return `this` for chaining.

> `empty ()` <br />
> `any ()`

Return `true` if array empty is/isn't empty.

> `first ()` <br />
> `last ()`

Return first/last agent in array. Return `undefined` if array is empty.

> `all (reporter)`

Returns true if reporter(agent) is true for every agent in the array. Equivalent to `array.every(reporter)`, here for NetLogo equivalence.

> `props (key)`

Returns an AgentArray of property values for key from this array's agents. If the property is not an agent, you may want to convert it to an Array: `let a = patches.props('id').toArray()`

> `with (reporter)`

Return an AgentArray with all agents with reporter(agent) true. Equivalent to filter(reporter).

> `ask (fcn)`

Call fcn(agent) for each agent in AgentArray

> `count (reporter)`

Return count of agents with reporter(agent) true

> `clone (begin = 0, end = this.length)`

Return shallow copy of a portion of this AgentArray. Default is to clone entire AgentArray. Equivalent to `slice(begin, end)`

> `shuffle ()`

Randomize the AgentArray in place. Use clone first if new AgentArray needed. Return `this` for chaining.

> `sortBy (reporter, ascending = true)`

Sort this AgentArray in place by the reporter in ascending/descending order. If reporter is a string, convert to a function returning that property. Use clone if you don't want to mutate this array. Return `this` for chaining.

> `oneOf ()`

Return a random agent. Return undefined if empty.

> `otherOneOf (agent)`

Return a random agent, not equal to `agent`

> `minOneOf (reporter)`

Return the first agent having the min value of reporter(agent).

> `maxOneOf (reporter)`

Return the first agent having the max value of reporter(agent).

> `nOf (n)`

Return n random unique agents as AgentArray. Error if n > length of array.

> `minNOf (n, reporter)` <br />
> `maxNOf (n, reporter)`

Return a new AgentArray of the n min/max agents of the value of reporter, in ascending order. If reporter is a string, convert to a fcn returning that property NOTE: we do not manage ties, see NetLogo docs.

### Geometry Methods

These methods are for patches, turtles, and other AgentArrays whose agents have x,y. Return all agents within rect, radius, cone from given agent. If meToo, include given agent, default is false. Typically the AgentArray is a subset of larger AgentArrays, reducing the size, then uses these inRect, inRadius or inCone methods.

> `inRect (agent, dx, dy = dx, meToo = false)`

Return all agents within rectangle from given agent.

> `inRadius (agent, radius, meToo = false)`

Return all agents in AgentArray within d distance from given agent.

> `inCone (agent, radius, coneAngle, direction, meToo = false)`

As `inRadius`, but also limited to the angle `coneAngle` around a `direction` from given agent.

### Inherited Methods

All Array methods: see [MDN Document](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

## Properties

None

### Inherited Properties

> `length`

Array.length: patches.length works as with any Array or Array subclass.

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/AgentArray.js).
