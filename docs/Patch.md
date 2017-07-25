# Patch.js

The patches AgentSet creates the Patch instances it contains. Class Patch is an argument to `new Patches(model, Patch, 'patches')`

## Statics

> `static defaultVariables ()`

Returns an object with defaulted variables for the Patch constructor.

## Constructor

> `constructor ()`

Called by patches.add(), you won't need this.

Simply does: `Object.assign(this, Patch.defaultVariables())`

Note that the patches [AgentSet adds several properties](AgentSet?id=agentclass-mixin) and methods that are shared by all AgentSet agents.

## Methods

> `x` <br />
> `y`

Getter/setter pair for patch location, derived from `id` and world properties.

> `isOnEdge ()`

Return true if this patch is on the edge of the world. Example: color the edges 'red'

patches.ask(p => {if (p.isOnEdge()) p.color = 'red'})

> `neighbors` <br />
> `neighbors4`

Return the neighbors of this patch.

These initially are getters, which, when called, promote their data to the patch variables. Why? Many models do not use these, thus we do not instantiate them until used.

Hint: If you don't need the performance created by this "lazy evaluation" technique, you can simply call `patches.neighbors(this)` giving the same result without instantiate the data.

> `turtlesHere ()`

Return the turtles on this patch. This uses the lazy evaluation approach as `neighbors`. The first time it is called, it caches the turtles on this patch in `p.turtles`. Then as turtles move, they add/remove themselves from the cache as needed. Otherwise the turtles do not use the cache.

This is used in geometry methods like `patches.inRadius(...)` as a form of quad tree.

> `breedsHere (breed)`

As above but returning only turtles of this breed

> `setColor (color)`

Set this patch's color. The color can be any color type, but will be converted to Color.color().pixel and stored in a pixel array for fast rendering.

> `getColor (sharedColor = null)`

Return color as a Color.color() with the correct pixel value. If a shared Color.color is given, it's pixel is simply set. This can be a performance win.

> `setLabel (label)` (labels currently unimplemented)

Set this patch's label. Uses patches.setLabel(this, label) for a label cache.

To delete the label, pass null or undefined, or simply call p.setLabel().

> `getLabel ()`

Return the label or undefined if no label set.

> **Note:** the next 6 methods are also in class Turtle. <br />
> `distanceXY (x, y)`

Distance between this patch and the x, y coordinates. Both must be on-world.

> `distance (agent)`

Same using the agent.x/y values. Agent can be patch or turtle .. both have x,y.

> `towardsXY (x, y)`

Return the direction, in radians, from this patch towards the x,y coordinates.

> `towards (agent)`

Ditto for the direction from this patch towards the agent (patch or turtle).

> `patchAt (dx, dy)`

Return patch w/ given *relative* dx, dy (floats) from this patch. Return undefined if off-world.

Note: this is not the same as patches.patch(x, y) which gives the patch at the *absolute* x,y coordinates.

> `patchAtDirectionAndDistance (direction, distance)`

Return the patch at the given direction, in radians, and distance, in patchSize units, from this patch.

> `sprout (num = 1, breed = this.model.turtles, initFcn = (turtle) => {})`

Factory method for creating turtles at this patch's location. It is identical to `Turtles.create(num, initFcn)` with the exception that the turtles initial x,y values are this patch's. The initFcn is called with each newly created turtle.

Returns an AgentArray of the new turtles.

## Properties

> `id`

The unique ID for this patch. Assigned by patches.add(). Is equal to patch's Array index due to patches being fixed length.

> `color`

Getter/setter pair for `getColor`, `setColor` methods.

> `label`

Getter/setter pair for `getLabel`, `setLabel` methods.

> `labelOffset` <br />
> `labelColor`

Properties for drawing the label for this patch. The offset is from the patch x,y.

> `turtles` (private)

The turtles currently on me, lazily created by `turtlesHere ()` above.

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Patch.js).
