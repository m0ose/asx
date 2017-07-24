# Link.js

The links AgentSet creates the Link instances it contains. Class Link is an argument to `new Links(model, Link, 'links')`

## Statics

> `static defaultVariables ()`

Returns an object with defaulted variables for the Link constructor.

## Constructor

> `constructor ()`

Called by links.add(), you won't need this.

Simply does: `Object.assign(this, Link.defaultVariables())`

## Methods

> `init (from, to)`

Called by links.create(). Adds the from, to turtles to this link.

> `die ()`

Remove this link from it's baseSet (and breed if needed). Also removes this link from it's two turtle nodes.

> `bothEnds ()`

Returns an array, [from, to], of this link's turtle nodes. Same order as given to `links.create(from, to, fcn)`.

> `length ()`

Return distance between from, to turtles.

> `otherEnd (turtle)`

Given a turtle node of a link, returns the other one. Throws an error if turtle is neither of the link turtles.``

## Properties

> `end0` <br />
> `end1`

The from, to turtles, in that order.

> `color`

The link color, defaults to yellow.

> `width`

Line width. In Three.js/webgl this is always 1.

See [Drawing Lines is Hard!](https://mattdesl.svbtle.com/drawing-lines-is-hard)

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Link.js).
