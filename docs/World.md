# World.js

Class World defines the coordinate system for the model. It is a grid specified by 5 properties: patchSize, minX/Y, maxX/Y. The grid squares are called `patches`.

The grid world is euclidean: the usual x,y axes with angles (theta) in radians, measured counter clockwise from the +x axis. We also support z in the Three renderer. It follows the so-called [right-hand rule](https://en.wikipedia.org/wiki/Right-hand_rule).

Some terminology:
* Direction/Angle: The euclidean angle, or theta, in radians.
* Heading: A world transform with angles measured in degrees from +Y (up/north), clockwise.

## Statics

> `static defaultOptions (size = 13, max = 16)`

Returns a set of 5 default properties: patchSize, minX/Y, maxX/Y.

The default is patchSize = 13, minX/Y = -16, maxX/Y = 16. These properties can be changed via different arguments (a square world of "radius" max, and "size" for each grid element), or  custom built by providing the 5 defaults.

## Constructor

> `constructor (options)`

Use the 5 option properties to initialize the world. The options are easily made via the static defaultOptions method.

## Methods

> `setWorld ()`

Used by the constructor to add eight derived properties:

* numX, numY: number of horizontal/vertical patches
* width, height: number of horizontal/vertical pixels
* minX/Ycor, maxX/Ycor: minX/Y, maxX/Y expanded by 0.5 in each direction.

The minX/Ycor, maxX/Ycor are floats which define the "edge" of the world, sometimes called "turtle coordinates". The minX/Y, maxX/Y integers define the center of the patches which are inset from the edge.

> `isOnWorld (x, y)`

Return true if the float x,y values are inside the edges of the world.

## Properties

From the constructor options (5):
* patchSize, minX/Y, maxX/Y

From setWorld (8):
* numX, numY, width, height, minXcor, minYcor, maxXcor, maxYcor

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/World.js).
