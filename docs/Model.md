# Model.js

Class Model coordinates the AgentSets and the Renderer into a traditional ABM. It imports most of the AgentScript Modules to do so!

A typical model creates a subclass of class Model, which overrides two abstract methods:
* `setup()`: A method called to initialize your model.
* `step()`: A method called every "tick" of the model's animator to advance its logic/state in time.

## Statics

Two static methods which return options used by the constructor.
> `static defaultWorld (size = 13, max = 16)` <br />
> `static defaultRenderer ()`


## Constructor

> `constructor (div, worldOptions, rendererOptions)`

The constructor takes three arguments: a div, an object of world parameters, and an object with renderer options. All are defaulted like this:

```javascript
constructor (div = document.body,
             worldOptions = Model.defaultWorld(),
             rendererOptions = Model.defaultRenderer())
```

The div is the class name or a DOM element in which to place the model
The World module defines the [default world](World?id=statics).
Similarly for the renderer options.

To see what these look like, run the [Hello World](tutorial/?hello ":ignore") model, open the console, and enter `Model.defaultWorld()` and `Model.defaultRenderer()`

## Methods

> `setup ()` <br />
> `step ()`

The two abstract methods you must override in your subclass of class Model.

> `start ()` <br />
> `stop ()` <br />
> `once ()`

Start/stop the model's animator. The once() method will stop the animator if it is running, and "setp" in just once. This is good for debugging and managing a model without using it's builtin animator.

One use of these is to modify your model, and restart it without reloading the page.

To change just your step function: `stop()` your model, change the `step()` method, and then restart using `start()`

To change setup (and step if you'd like): `stop()` your model, change the `setup()` (and `step()`) method, and then restart using `setup(); start()`

> `draw ()`

Draws the model's patches, turtles, and links etc using the Renderer setting in Model's constructor.

> `patchBreeds (breedNames)` <br />
> `turtleBreeds (breedNames)` <br />
> `linkBreeds (breedNames)`

Given a string of space-separated names, creates breads of that name. So for turtles, `turtleBreeds('foxes rabbits')` would create two new turtles breeds, foxes & rabbits via `turtles.newBreed('foxes')` & `turtles.newBreed('rabbits')`

## Properties

> `div`: the DOM element for the model <br />
> `patches`, `turtles`, `links`: The three major AgentSets <br />
> `<breeds>`: The breeds created by the three methods above. <br />
> `spriteSheet`: A canvas of images used by the renderer. <br />
> `view`: The renderer created by the constructor. <br />
> `world`: The class World instance created by the constructor.

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Model.js).
