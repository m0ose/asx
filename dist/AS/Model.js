import World from './World.js'
import Patches from './Patches.js'
import Patch from './Patch.js'
import Turtles from './Turtles.js'
import Turtle from './Turtle.js'
import Links from './Links.js'
import Link from './Link.js'
import Animator from './Animator.js'
import SpriteSheet from './SpriteSheet.js'
import Three from './Three.js'
import Meshes from './ThreeMeshes.js'
import util from './util.js'

// Class Model is the primary interface for modelers, integrating
// all the parts of a model. It also contains NetLogo's `observer` methods.
class Model {
  // Static class methods for default settings.
  // Default world is centered, patchSize = 13, min/max = 16
  static defaultWorld (size = 13, max = 16) {
    return World.defaultOptions(size, max)
  }
  // Default renderer is Three.js
  static defaultRenderer () {
    return Three.defaultOptions()
  }

  // The Model constructor takes a DOM div and model and renderer options.
  // Default values are given for all constructor arguments.
  constructor (div = document.body,
               worldOptions = Model.defaultWorld(),
               rendererOptions = Model.defaultRenderer()) {
    // Store and initialize the model's div and contexts.
    this.div = util.isString(div) ? document.getElementById(div) : div
    this.spriteSheet = new SpriteSheet()

    // Create this model's `world` object
    this.world = new World(worldOptions)

    // Initialize view
    this.view = new rendererOptions.Renderer(this, rendererOptions)

    // Initialize meshes.
    this.meshes = {}
    util.forEach(rendererOptions.meshes, (val, key) => {
      const options = Meshes[val.meshClass].options() // default options
      Object.assign(options, val) // override by user's
      this.meshes[key] = new Meshes[val.meshClass](this.view, options)
    })

    // Create animator to handle draw/step.
    this.anim = new Animator(this)

    // Initialize model calling `startup`, `reset` .. which calls `setup`.
    this.modelReady = false
    this.startup().then(() => {
      // this.reset(); this.setup(); this.modelReady = true
      this.reset(); this.modelReady = true
    })
  }
  // Call fcn(this) when any async
  whenReady (fcn) {
    // util.waitPromise(() => this.modelReady).then(fcn())
    util.waitOn(() => this.modelReady, () => fcn(this))
  }
  // Add additional world variables derived from constructor's `modelOptions`.
  // setWorld () {
  //   const world = this.world
  //   // REMIND: change to xPatches, yPatches?
  //   world.numX = world.maxX - world.minX + 1
  //   world.numY = world.maxY - world.minY + 1
  //   world.width = world.numX * world.patchSize
  //   world.height = world.numY * world.patchSize
  //   world.minXcor = world.minX - 0.5
  //   world.maxXcor = world.maxX + 0.5
  //   world.minYcor = world.minY - 0.5
  //   world.maxYcor = world.maxY + 0.5
  //   world.isOnWorld = (x, y) => // No braces, is lambda expression
  //     (world.minXcor <= x) && (x <= world.maxXcor) &&
  //     (world.minYcor <= y) && (y <= world.maxYcor)
  // }
  // createQuad (r, z = 0) { // r is radius of xy quad: [-r,+r], z is quad z
  //   const vertices = [-r, -r, z, r, -r, z, r, r, z, -r, r, z]
  //   const indices = [0, 1, 2, 0, 2, 3]
  //   return {vertices, indices}
  // }
  // (Re)initialize the model. REMIND: not quite right
  reset (restart = false) {
    this.anim.reset()
    this.world.setWorld()

    this.refreshLinks = this.refreshTurtles = this.refreshPatches = true

    // Breeds handled by setup
    this.patches = new Patches(this, Patch, 'patches')
    this.meshes.patches.init(this.patches)
    // this.patchesMesh.init(0, this.patches.pixels.ctx.canvas)

    this.turtles = new Turtles(this, Turtle, 'turtles')
    // this.turtlesMesh.init(1, 1, new THREE.Color(1, 1, 0))
    // this.turtlesMesh.init(1, 1)
    this.meshes.turtles.init(this.turtles)

    this.links = new Links(this, Link, 'links')
    // this.linksMesh.init(0.9)
    this.meshes.links.init(this.links)

    this.setup()
    if (restart) this.start()
  }

// ### User Model Creation
  // A user's model is made by subclassing Model and over-riding these
  // three abstract methods. `super` need not be called.

  // Async function to initialize model resources (images, files).
  async startup () {} // called by constructor.
  // Initialize your model variables and defaults here.
  setup () {} // called by constructor (after startup) or by reset()
  // Update/step your model here
  step () {} // called each step of the animation

  // Start/stop the animation. Return model for chaining.
  start () {
    util.waitOn(() => this.modelReady, () => {
      this.anim.start()
    })
    // util.waitPromise(() => this.modelReady)
    // .then(() => { this.anim.start() })
    return this
  }
  stop () { this.anim.stop() }
  // Animate once by `step(); draw()`.
  once () { this.stop(); this.anim.once() } // stop is no-op if already stopped

  // Change the world parameters. Requires a reset.
  // Resets Patches, Turtles, Links & reinitializes canvases.
  // If restart argument is true (default), will restart after resetting.
  // resizeWorld (modelOptions, restart = true) {
  //   Object.assign(this.world, modelOptions)
  //   this.setWorld(this.world)
  //   this.reset(restart)
  // }

  draw (force = this.anim.stopped || this.anim.draws === 1) {
    // const {scene, camera} = this.view
    if (this.div) {
      if (force || this.refreshPatches) {
        if (this.patches.length > 0)
          // this.patchesMesh.update(this.patches)
          this.meshes.patches.update(this.patches)
        // this.view.updatePatchesMesh(this.patches)
      }
      if (force || this.refreshTurtles) {
        if (this.turtles.length > 0)
          // this.view.updateTurtlesMesh(this.turtles)
          // this.turtlesMesh.update(this.turtles)
          this.meshes.turtles.update(this.turtles)
          // this.view.updatePointsMesh('turtlesMesh', this.turtles)
      }
      if (force || this.refreshLinks) {
        if (this.links.length > 0)
          // this.view.updateLinksMesh(this.links)
          // this.linksMesh.update(this.links)
          this.meshes.links.update(this.links)
      }

      // REMIND: generalize.
      this.view.renderer.render(this.view.scene, this.view.camera)
    }
    if (this.view.stats) this.view.stats.update()
  }

  // Breeds: create subarrays of Patches, Agentss, Links
  patchBreeds (breedNames) {
    for (const breedName of breedNames.split(' ')) {
      this[breedName] = new Patches(this, Patch, breedName, this.patches)
    }
  }
  turtleBreeds (breedNames) {
    for (const breedName of breedNames.split(' ')) {
      this[breedName] = new Turtles(this, Turtle, breedName, this.turtles)
    }
  }
  linkBreeds (breedNames) {
    for (const breedName of breedNames.split(' ')) {
      this[breedName] = new Links(this, Link, breedName, this.links)
    }
  }
}

export default Model
