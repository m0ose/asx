# Turtles.js

Turtles is the AgentSet for the dynamic Turtle agents. They move on the patch World instance, with float values in minXcor, maxXcor, minYcor, maxYcor where each is 0.5 outset from the Model's minX, maxX, minY, maxY integer values.

## Constructor

None. Identical to AgentSet's [constructor](AgentSet?id=constructor).

The model.turtles are created by class Model: `new Turtles(model, Turtle, 'turtles')`

## Statics

None.

## Methods

> `create (num = 1, initFcn = (turtle) => {})`

Create `num` instances of class Turtle, and add to the turtles AgentSet. Use initFcn to initialize the turtle. Ex:

```
turtles.create(10, t => {
  t.size = 2 // set size to 2 patches (2 * world.patchSize pixels)
})
```

If called with a turtle breed, will create instances of that breed.

If a color is not set by the completion of the initFcn, a random color is assigned.

> `randomPt ()`

Return a random valid float x,y point in turtle space. Note this differs from patches.randomPt which returns a valid patch int x,y point.

Ex: Patch x values are random ints in minX, maxX. Turtle x values are random floats in minX - 0.5, maxX + 0.5.

> `inPatches (patches)`

Return an AgentArray of the turtles in this array of patches.

If called by a breed of turtles, returns only the breeds in the array.

> `inPatchRect (turtle, dx, dy = dx, meToo = false)`

Return an AgentArray of this AgentSet (turtles/breeds) within the patchRect, centered on turtle.patch and dx, dy (integers) in size.

> `inRadius (turtle, radius, meToo = false)`

Return the members of this AgentSet that are within radius `distance` from turtle.

Uses `inPatchRect` initially for performance, then `AgentSet.inRadius()`.

> `inCone (turtle, radius, coneAngle, meToo = false)`.

As above, restricted to be in the cone. Uses `inPatchRect`, then `AgentSet.inCone()`.

> `layoutCircle (radius, center = [0, 0], startAngle = Math.PI / 2, direction = -1)`

Circle Layout: position the turtles in this breed in an equally spaced circle of the given radius, with the initial turtle at the given start angle (default to pi/2 or "up") and in the +1 or -1 direction (counter clockwise or clockwise) defaulting to -1 (clockwise).

## Properties

None. Inherit AgentSet properties.

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Turtles.js).
