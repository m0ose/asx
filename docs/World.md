# World.js

Class World defines the coordinate system for the model. It is a grid specified by 5 properties: patchSize, minX/Y, maxX/Y. The grid squares are called `patches`

## Statics

> `static defaultOptions (size = 13, max = 16)`

Returns a set of 5 default properties: patchSize, minX/Y, maxX/Y.

The default is patchSize = 13, minX/Y = -16, maxX/Y = 16. These properties can be changed via different arguments (a square world of "radius" max, and "size" for each grid element), or  custom built by providing the 5 defaults.

## Constructor

> `constructor (options)`

Use the 5 option properties to initialize the world. The options are easily made via the static defaultOptions method.

## Methods

> `setWorld ()`

Used by the constructor to add several derived properties:

* numX, numY: number of horizontal/vertical patches
* width, height: number of horizontal/vertical pixels
* minX/Ycor, maxX/Ycor: minX/Y, maxX/Y expanded by 0.5 in each direction.

The minX/Ycor, maxX/Ycor are floats which define the "edge" of the world, sometimes called "turtle coordinates". The minX/Y, maxX/Y integers define the center of the patches which are inset from the edge.

> `isOnWorld (x, y)`

Return true if the float x,y values are inside the edges of the world.

## Properties

From the constructor options:
* patchSize, minX/Y, maxX/Y

From setWorld:
* numX, numY, width, height, minX/Ycor, maxX/Ycor

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/World.js).
