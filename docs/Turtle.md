# Turtle.js

The turtles AgentSet creates the Turtle instances it contains. Class Turtle is an argument to `new Turtles(model, Turtle, 'turtles')`

## Statics

> `static defaultVariables ()`

Returns an object with defaulted variables for the turtle constructor.

## Constructor

> `constructor ()`

Called by turtles.add(), you won't need this.

Simply does: `Object.assign(this, Turtle.defaultVariables())`

## Methods

> `die ()`

Remove this turtle from it's baseSet (and breed if needed). Also removes any links attached to it.

> `hatch (num = 1, agentSet = this.agentSet, init = (turtle) => {})`

Factory method for creating turtles at this turtle's location. Similar to patch.sprout method. The initFcn is called with each newly created turtle.

Returns an AgentArray of the new turtles.

> `setSprite (src, color = this.color, strokeColor = this.strokeColor)`

Set this turtle's sprite from src, color, & strokeColor. If src is a sprite, set and return, otherwise ask model's spriteSheet to create a new sprite.

Note: typically best to set src, color & stroke as defaults, reducing turtle's size.

> `setSize (size)`

Set this turtle's size, in patchSize units.

> `setxy (x, y, z = null)`

Set this turtle's position. If z is null, fallback to it's default.

If x,y off-world, use handleEdge.

> `handleEdge (x, y)`

If setxy is off-world, use this method to manage edge behavior using the turtle.atEdge property. This can be a string (`wrap`, `clamp`, `bounce`) or a function taking the turtle as an argument.

> `moveTo (agent)`

Place this turtle at the agent's x,y location.

> `forward (distance)`

Moves this turtle distance (patchSize units) in it's current direction.

> `rotate (rad)`

Change this turtle's direction by rad radians.

> `right (rad)` <br />
> `left (rad)`

Use `rotate` to turn right/left by rad radians.

> `face (agent)` <br />
> `faceXY (x, y)`

Use towards, towardsXY below to set this turtle's direction to be towards and agent or an x,y point.

> `patchAhead (distance)`

Return the patch ahead of this turtle by distance (patchSize units). Return `undefined` if off-world.

> `canMove (distance)`

Use `patchAhead` to determine if this turtle can move forward by distance.

> `patchLeftAndAhead (angle, distance)`

Use `patchAtDirectionAndDistance` below to return the patch to the left (counter-clockwise) of my direction by angle radians, and the given distance in patchSize units.

> `patchRightAndAhead (angle, distance)`

Ditto for to the right, clockwise.

> **Note:** the next 6 methods are also in class Patch. <br />
> `distanceXY (x, y)`

Distance between this turtle and the x, y coordinates. Both must be on-world.

> `distance (agent)`

Same using the agent.x/y values. Agent can be patch or turtle .. both have x,y.

> `towardsXY (x, y)`

Return the direction, in radians, from this turtle towards the x,y coordinates.

> `towards (agent)`

Ditto for the direction from this turtle towards the agent (patch or turtle).

> `patchAt (dx, dy)`

Return patch w/ given *relative* dx, dy (floats) from this turtle. Return undefined if off-world.

> `patchAtDirectionAndDistance (direction, distance)`

Return the patch at the given direction, in radians, and distance, in patchSize units, from this turtle.

> Two links methods. Links are lines between two turtles. <br />
> `otherEnd (l)`

Return the turtle at the other end of this link (pair of turtles)

> `linkNeighbors ()`

Return all the turtles linked to me. Like patch neighbors.

## Properties

> `id`

The unique ID for this turtle. Assigned by turtles.add().

> `x, y, z`

This turtle's position. Each defaults to 0.

> `theta`

This turtle's euclidean direction, radians from x axis, counter-clockwise.

> `size`

This turtle's size in patchSize units, default to one patch.

> `atEdge`

Behavior for turtle at edge: 'clamp', 'wrap', 'bounce', or function, see handleEdge.
Default: 'clamp'.

> `sprite`

A spriteSheet object with a shape, color and optional strokeColor. Or simply an image with no associated colors. Used by renderer. Default is null.

> `color`, `strokeColor`, `shape`

Individual components of a sprite. A renderer may not use these, for example Three Point geometries typically only use a color.

> `get links ()`

Getter for the array of links this turtle belongs to. It lazily creates a links instance variable for the array and never is called again.

> `links`

The array the links getter creates.

> `get patch ()`

Getter for the patch I'm on. Return null if off-world.

> `get heading ()` <br />
> `set heading (heading)`

Getter/setter pair for this turtle's direction using clock angles in degrees: 0 degrees is north/up, angle increases in clockwise direction. This is the original Logo angle, inherited by NetLogo, after which AgentScript is designed.

> `get direction ()` <br />
> `set direction (theta)`

Alias for theta. Mainly here while we decide the best way to treat the difference between headings and directions.

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Turtle.js).
