# Model.js

Class Model coordinates the AgentSets and the Renderer into a traditional ABM. It imports most of the AgentScript Modules to do so!

A typical model creates a subclass of Model, which overrides three abstract methods:
* `startup()`: An [async function](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9) used for loading resources, using [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), just once for the model. For example, you may load images, files, data etc here without having to manage the associated Promises used to fetch them. Our util.js module has several functions creating Promises for you.
* `setup()`: A method called each time you `reset()` your model. For example, you might `stop()` your model, change the `setup()` method, and then restart using `reset()` it with new behavior, without reloading the page.
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

To see what these look like, run the [Hello World](http://backspaces.github.io/asx//tutorial/?hello) model, open the console, and enter `Model.defaultWorld()` and `Model.defaultRenderer()`

## Methods

> `whenReady (fcn)`

As mentioned above describing `startup()`, the initialization of a model is async. So if you need to do more after creating your model, you'd do something like this:

```javascript
const model = new MyModel().start()
model.whenReady(() => { // debugging
  console.log('patches:', model.patches.length)
  console.log('turtles:', model.turtles.length)
  console.log('links:', model.links.length)
  const {world, patches, turtles, links} = model
  util.toWindow({ world, patches, turtles, links, model })
})
```

There are two cases of whenReady here:
* `model.start()`: Internally, start() waits until ready then starts the animator.
* `model.whenReady()`: Is used to log information and copy to window several objects which would not have been created if we didn't wait.

> `reset (restart = false)`

The `reset()` method is used to both initialize the model and reinitialize it if you make changes and want to start over without reloading the page. It will not call `startup()`, but will call `setup()`. If `restart` is true, it will also call `start()` to immediately start the model running.

> `async startup ()` <br />
> `setup ()` <br />
> `step ()`

The three abstract methods you must override in your subclass of class Model.

> `start ()` <br />
> `stop ()` <br />
> `once ()`

Start/stop the model's animator. The once() method will stop the animator if it is running, and "setp" in just once. This is good for debugging and managing a model without using it's builtin animator.

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
> `view`: The renderer. <br />
> `world`: The object created by the World module. <br />

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Model.js).
