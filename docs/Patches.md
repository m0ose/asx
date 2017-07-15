# Patches.js

Patches is the AgentSet subset for the grid "world" of an ABM. They use thoe coordinate system defined by [class World](World).

They create the patch world other AgentSets live on, using the patchSize, minX, maxX, minY, maxY in the model.world instance created by class Model's constructor.

## Statics

None

## Constructor

> `constructor (model, AgentProto, name, baseSet = null)`

Identical to AgentSet's [constructor](AgentSet?id=constructor).

In addition, the constructor:
* Creates its Patch "agents".
* Creates a small canvas with one pixel per patch for viewing.
* Creates a sparse array for text labels. Not currently implemented.

## Methods

> `populate ()` <br />
> `setPixels ()` <br />
> `setImageData ()`

Used by the constructor.

> `setLabel (patch, label)` <br />
> `getLabel (patch)`

Used to set/get labels for the given patch. Not currently implemented.

> `neighborsOffsets (x, y)` <br />
> `neighbors4Offsets (x, y)`

Utilities for the two following methods. Returns the AgentArray indices for the given x, y values.

> `neighbors (patch)`

Returns the [Moore neighborhood](https://en.wikipedia.org/wiki/Moore_neighborhood) for the given patch, using the `neighborsOffsets` utility.

This is used by the Patch agents: p.neighbors() calls p.patches.neighbors(this)

For patches not on the edge of the world, returns 8 patches. For corner patches, returns 3 patches. For edge patches, returns 5 patches.

This can be useful for finding the boundary patches:
`const edgePatches = patches.with(p => p.neighbors.length < 8)`

> `neighbors4 (patch)`

Returns the [Von Neumann neighborhood](https://en.wikipedia.org/wiki/Von_Neumann_neighborhood) for the given patch.

This is used by the Patch agents: p.neighbors4() calls p.patches.neighbors4(this)

For patches not on the edge of the world, returns 4 patches. For corner patches, returns 2 patches. For edge patches, returns 3 patches.

As for `neighbors`, this can be useful for finding the boundary patches:
`const edgePatches = patches.with(p => p.neighbors4.length < 4)`

> `randomPt ()`

Return a random valid int x,y point in patch space. Note this differs from turtles.randomPt which returns a valid turtle float x,y point.

Ex: Patch x values are random ints in minX, maxX. Turtle x values are random floats in minX - 0.5, maxX + 0.5.

`patches.randomPt` corresponds to NetLogo's random-pxcor, random-pycor

> `randomPatch ()`

Return a random patch.

> `patchRect (p, dx, dy = dx, meToo = true)`

Return all patches in rectangle dx, dy from p, dx, dy integers. Include p itself if meToo is true.

> `installPixels ()`

This is a "fine point". The patch colors are installed in an ImageData object, a raw set of pixels. This functions "pushes" the pixels back into the canvas object itself so it can be used as an image. Used to update a Three.js texture, for example.

> `importColors (imageSrc)`

Imports an image URL into the patch colors. It will scale the image to "fit" the patches. It is an async operation, using a promise, thus will not be visible until the async operation complete. This is generally one or two animation steps and seldom is an issue.

> `installColors (img)`

Direct install of an image or canvas into the patch colors, not async.

> `importDataSet (dataSet, patchVar, useNearest = false)`

Import a dataSet's data into the given patchVar name, resampling the dataSet to the size of the patches. `useNearest`: true for fast rounding; false for bi-linear interpolation.

Ex: given an elevation dataSet, `importDataSet (elevation, 'elevation')` would set patch.elevation based on the resampled elevation dataSet.

> `exportDataSet (patchVar, Type = Array)`

Return a new dataSet created from the given patch variable name. It defaults to making an Array dataSet but any TypedArray can also be used. Using a TypedArray can cause loss of precision.

> `patch (x, y)`

Return patch at x,y float values (i.e. turtle coordinates). Return undefined if off-world.

> `patchXY (x, y)`

Return the patch at x,y where both are valid integer patch coordinates.

## Properties

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Patches.js).
