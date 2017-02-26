import Patches from './Patches.js'
import patchProto from './Patch.js'
import Animator from './Animator.js'
import * as THREE from 'etc/three.min.js'
import OrbitControls from 'etc/threelibs/OrbitControls.js'
import Stats from 'etc/stats.min.js'
// import dat from 'etc/dat.gui.min.js'
import util from './util.js'

// Class Model is the primary interface for modelers, integrating
// all the parts of a model. It also contains NetLogo's `observer` methods.
class Model {
  // Static class methods for default settings.
  static defaultWorld () {
    return {
      patchSize: 13,
      minX: -16,
      maxX: 16,
      minY: -16,
      maxY: 16
    }
  }
  static defaultThree () {
    return {
      orthoView: false, // 'Perspective', 'Orthographic'
      clearColor: 0x000000,
      useAxes: true,
      useGrid: true,
      useStats: true,
      useControls: true
    }
  }

  // The Model constructor takes a DOM div and overrides for defaults
  constructor (div = document.body, worldOptions = {}, threeOptions = {}) {
    // Store and initialize the model's div and contexts.
    this.div = util.isString(div) ? document.getElementById(div) : div

    // Create this model's `world` object
    this.world = Model.defaultWorld()
    Object.assign(this.world, worldOptions)
    this.setWorld()

    // Initialize Three.js
    this.three = Model.defaultThree()
    Object.assign(this.three, threeOptions)
    this.initThree()
    this.initThreeHelpers()

    // Initialize the model by calling `startup` and `reset`.
    // If `startup` returns a promise, or generator/iterator, manage it.
    // Arrow functions used to maintain `this`, lexical scope.
    this.modelReady = false
    const setupFcn = () => { this.reset(); this.modelReady = true }
    util.runAsyncFcn(() => this.startup(), setupFcn)
  }
  // (Re)initialize the model.
  reset (restart = false) {
    if (this.anim) this.stop()
    this.setWorld()
    this.anim = new Animator(this)
    this.refreshLinks = this.refreshTurtles = this.refreshPatches = true
    this.patches = new Patches(this, patchProto, 'patches')
    this.initPatchsMesh(this.patches.pixels.ctx.canvas)
    // REMIND: temp
    // this.div.appendChild(this.patches.pixels.ctx.canvas)
    // document.body.appendChild(this.patches.pixels.ctx.canvas)
    this.setup()
    if (restart) this.start()
  }
  initThree () {
    const {clientWidth, clientHeight} = this.div
    const {orthoView, clearColor} = this.three
    const {width, height} = this.world
    const [halfW, halfH] = [width / 2, height / 2]

    const scene = new THREE.Scene()
    const camera = orthoView
      ? new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 1, 1000)
      : new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 1, 10000)

    if (orthoView)
      camera.position.set(0, 0, 100 * width)
    else
      camera.position.set(width, -width, width)
    camera.up.set(0, 0, 1)

    const renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(clientWidth, clientHeight)
    renderer.setClearColor(clearColor)
    this.div.appendChild(renderer.domElement)

    window.addEventListener('resize', () => {
      const {clientWidth, clientHeight} = this.div
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    })

    Object.assign(this.three, {scene, camera, renderer})
  }
  initThreeHelpers () {
    const {scene, renderer, camera} = this.three
    const {useAxes, useGrid, useControls, useStats} = this.three
    const {width} = this.world
    const helpers = {}

    if (useAxes) {
      helpers.axes = new THREE.AxisHelper(1.5 * width / 2)
      scene.add(helpers.axes)
    }
    if (useGrid) {
      // helpers.grid = new THREE.GridHelper(width, width / patchSize)
      helpers.grid = new THREE.GridHelper(1.25 * width, 10)
      helpers.grid.rotation.x = THREE.Math.degToRad(90)
      scene.add(helpers.grid)
    }
    if (useStats) {
      helpers.stats = new Stats()
      document.body.appendChild(helpers.stats.dom)
    }
    if (useControls) {
      helpers.controls = new OrbitControls(camera, renderer.domElement)
    }

    Object.assign(this.three, helpers)
  }
  // Add additional world variables derived from constructor's `worldOptions`.
  setWorld () {
    const world = this.world
    // REMIND: change to xPatches, yPatches?
    world.numX = world.maxX - world.minX + 1
    world.numY = world.maxY - world.minY + 1
    world.width = world.numX * world.patchSize
    world.height = world.numY * world.patchSize
    world.minXcor = world.minX - 0.5
    world.maxXcor = world.maxX + 0.5
    world.minYcor = world.minY - 0.5
    world.maxYcor = world.maxY + 0.5
  }
  initPatchsMesh (canvas) {
    const {width, height, numX, numY} = this.world
    const texture = new THREE.Texture(canvas)
    // texture.generateMipmaps = false
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    // texture.premultiplyAlpha = false

    const geometry = new THREE.PlaneGeometry(width, height, numX, numY)
    const material = new THREE.MeshBasicMaterial({
      map: texture, shading: THREE.FlatShading
      //, side: THREE.DoubleSide//, wireframe: true
    })
    const mesh = this.three.patchesMesh = new THREE.Mesh(geometry, material)
    // mesh.rotation.x = -Math.PI / 2
    this.three.scene.add(mesh)
  }

// ### User Model Creation
  // A user's model is made by subclassing Model and over-riding these
  // three abstract methods. `super` need not be called.

  // Initialize model resources (images, files) here.
  // Return a promise or a generator/iterator or null/undefined.
  startup () {} // called by constructor.
  // Initialize your model variables and defaults here.
  setup () {} // called by constructor (after startup) or by reset()
  // Update/step your model here
  step () {} // called each step of the animation

  // Start/stop the animation. Return model for chaining.
  start () {
    util.waitOn(() => this.modelReady, () => this.anim.start())
    return this
  }
  stop () { this.anim.stop() }
  // Animate once by `step(); draw()`.
  once () { this.stop(); this.anim.once() } // stop is no-op if already stopped

  // Change the world parameters. Requires a reset.
  // Resets Patches, Turtles, Links & reinitializes canvases.
  // If restart argument is true (default), will restart after resetting.
  // resizeWorld (worldOptions, restart = true) {
  //   Object.assign(this.world, worldOptions)
  //   this.setWorld(this.world)
  //   this.reset(restart)
  // }

  draw (force = this.anim.stopped || this.anim.draws === 1) {
    const {scene, camera, renderer, patchesMesh} = this.three
    if (this.div) {
      // REMIND: use Three
      if (force || this.refreshPatches) {
        this.patches.installPixels()
        patchesMesh.material.map.needsUpdate = true
      }

      renderer.render(scene, camera)
    }
    if (this.three.stats) this.three.stats.update()
  }

  // Breeds: create subarrays of Patches, Agentss, Links
  patchBreeds (breedNames) {
    for (const breedName of breedNames.split(' ')) {
      this[breedName] = new Patches(this, patchProto, breedName, this.patches)
    }
  }
}

export default Model
