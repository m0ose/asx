# Patches.js

Patches is the [AgentSet](AgentSet) subset for the grid "world" of an ABM. They use thoe coordinate system defined by [class World](World).

They create the patch world other AgentSets live on, using the patchSize, minX, maxX, minY, maxY in the model.world instance created by class Model's constructor.

## Statics

None

## Constructor

> `constructor (model, AgentClass, name)`

Identical to AgentSet's [constructor](AgentSet?id=constructor).

The model.patches are created by class Model: `new Patches(model, Patch, 'patches')`

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

Utilities for the two following methods. Returns an array of neighbor offsets within the Patches AgentArray for the given x, y values.

> `neighbors (patch)`

Returns an AgentArray of the patches of the [Moore neighborhood](https://en.wikipedia.org/wiki/Moore_neighborhood) for the given patch, using the `neighborsOffsets` utility.

This is used by the Patch agents: p.neighbors() calls p.patches.neighbors(this)

For patches not on the edge of the world, returns 8 patches. For corner patches, returns 3 patches. For edge patches, returns 5 patches.

This can be useful for finding the boundary patches:
`const edgePatches = patches.with(p => p.neighbors.length < 8)`
or for setting variables:
`patches.patch(0,0).neighbors.ask(n => {n.color = 'red'})`

> `neighbors4 (patch)`

Returns the [Von Neumann neighborhood](https://en.wikipedia.org/wiki/Von_Neumann_neighborhood) for the given patch.

This is used by the Patch agents: p.neighbors4() calls p.patches.neighbors4(this)

For patches not on the edge of the world, returns 4 patches. For corner patches, returns 2 patches. For edge patches, returns 3 patches.

As for `neighbors`, this can be useful for finding the corner patches:
`const cornerPatches = patches.with(p => p.neighbors4.length === 2)`

> `randomPt ()`

Return a random valid int x,y point in patch space. Note this differs from turtles.randomPt which returns a valid turtle float x,y point.

Note: Patch x values are random ints in minX, maxX. Turtle x values are random floats in minX - 0.5, maxX + 0.5. Ditto  for Y.

Corresponds to NetLogo's random-pxcor, random-pycor

Note: to get a random patch use AgentArray's oneOf: `patches.oneOf()`.

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

> `patchRect (p, dx, dy = dx, meToo = true)`

Return all patches in rectangle dx, dy from p, dx, dy integers. Include p itself if meToo is true.

If called with a breed, returns the same values as if called with patches. Does not limit itself to only breeds in result.

> `cacheRect (dx, dy = dx, meToo = true)`

Install a cached version of patchRect(p, dx, dy, meToo). This increases the performance of `patchRect` when a cached rect is available.

> `inRect (p, dx, dy = dx, meToo = true)`

Return all patches/breeds in rectangle dx, dy from p, dx, dy integers. Include p itself if meToo is true.

Overrides AgentArray's inRect, taking advantage of the regular layout of the patches.

If called with a breed, returns the breeds in the rect. Otherwise the same as patchRect.

> `inRadius (patch, radius, meToo = true)`

Return all patches within radius from given agent.

Overrides AgentArray's inRadius, using patches.inRect, then super.inRadius.

> `inCone (patch, radius, coneAngle, direction, meToo = true)`

Return patches in cone from p in direction `angle`, with `coneAngle` width and `radius` distance from p.

> `patchAtDirectionAndDistance (obj, angle, distance)`

Return patch at distance and angle from obj's (patch or turtle) x, y (floats). If off world, return undefined.

To use heading rather than euclidean angle: `patchAtDirectionAndDistance(obj, util.angle(heading), distance)`

> `diffuse (v, rate, colorMap = null, min = 0, max = 1)`

Diffuse the value of patch variable `p.v` by distributing `rate` percent of each patch's value of `v` to its neighbors.

If a color map is given, scale the patch color via p.v's value where min/max are the min/max values for p.v.

If the patch is on edge, return the leftover value to the p.v

> `diffuse4 (v, rate, colorMap = null, min = 0, max = 1)`

A neighbor4 version of the above.

## Properties

* `pixels`: An object for managing pixel data for patch colors:
  * `pixels.ctx`: A numX * numY canvas context object, one pixel per patch
  * `pixels.imageData`: The ctx's ImageData object
  * `pixels.data8`: The ImageData's rgba Uint8Array
  * `pixels.data`: A Uint32Array view onto data8. Pixel values.

* `labels`: A collection of patch labels. Not currently implemented.
* `_diffuseNext`: A temporary patch variable used by the diffuse, diffuse4 methods.

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Patches.js).
