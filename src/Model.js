import Patches from './Patches.js'
import PatchProto from './Patch.js'
import Turtles from './Turtles.js'
import TurtleProto from './Turtle.js'
import Links from './Links.js'
import LinkProto from './Link.js'
import SpriteSheet from './SpriteSheet.js'
import Animator from './Animator.js'
import util from './util.js'

// import * as THREE from '../libs/three.min.js'
// import OrbitControls from '../libs/threelibs/OrbitControls.js'
// import Stats from '../libs/stats.min.js'
// import dat from '../libs/dat.gui.min.js'

// util.toWindow({three: THREE}) // REMIND

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
      // usePatches: true, // REMIND: Use these. Add Drawing? Labels?
      // useTurtles: true,
      // useLinks: true,
    }
  }
  static defaultThree () {
    return {
      orthoView: false, // 'Perspective', 'Orthographic'
      clearColor: 0x000000,
      useAxes: true,
      useGrid: true,
      useStats: true,
      useControls: true,
      useGUI: true
    }
  }

  // The Model constructor takes a DOM div and overrides for defaults
  constructor (div = document.body, worldOptions = {}, threeOptions = {}) {
    // Store and initialize the model's div and contexts.
    this.div = util.isString(div) ? document.getElementById(div) : div
    this.spriteSheet = new SpriteSheet()

    // Create this model's `world` object
    this.world = Model.defaultWorld()
    Object.assign(this.world, worldOptions)
    this.setWorld()

    // Initialize Three.js
    this.three = Model.defaultThree()
    Object.assign(this.three, threeOptions)
    this.initThree()
    this.initThreeHelpers()

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
  createQuad (r, z = 0) { // r is radius of xy quad: [-r,+r], z is quad z
    const vertices = [-r, -r, z, r, -r, z, r, r, z, -r, r, z]
    const indices = [0, 1, 2, 0, 2, 3]
    return {vertices, indices}
  }
  // (Re)initialize the model. REMIND: not quite right
  reset (restart = false) {
    this.anim.reset()
    this.setWorld()
    // this.three.unitQuad = util.createQuad(this.world.patchSize / 2, 0)
    this.three.unitQuad = util.createQuad(0.5, 0)
    this.refreshLinks = this.refreshTurtles = this.refreshPatches = true
    this.patches = new Patches(this, PatchProto, 'patches')
    this.initPatchesMesh(this.patches.pixels.ctx.canvas)
    this.turtles = new Turtles(this, TurtleProto, 'turtles')
    this.initTurtlesMesh()
    this.links = new Links(this, LinkProto, 'links')
    this.initLinksMesh()
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

    // this.spriteSheet.texture = new THREE.CanvasTexture(this.spriteSheet.ctx)
    // this.spriteSheet.setTexture(THREE.CanvasTexture)

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
    const {useAxes, useGrid, useControls, useStats, useGUI} = this.three
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
      // helpers.controls = new OrbitControls(camera, renderer.domElement)
      helpers.controls = new THREE.OrbitControls(camera, renderer.domElement)
    }
    if (useGUI) {
      helpers.gui = new dat.GUI()
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
    world.isOnWorld = (x, y) => // No braces, is lambda expression
      (world.minXcor <= x) && (x <= world.maxXcor) &&
      (world.minYcor <= y) && (y <= world.maxYcor)
  }
  initPatchesMesh (canvas) {
    const {width, height, numX, numY} = this.world
    // [CanvasTexture args:](https://goo.gl/HkTuHO)
    // canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy
    const texture = new THREE.CanvasTexture(canvas)
    // texture.generateMipmaps = false
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    // texture.premultiplyAlpha = false

    const geometry = new THREE.PlaneGeometry(width, height, numX, numY)
    geometry.name = 'patches'
    const material = new THREE.MeshBasicMaterial({
      map: texture, shading: THREE.FlatShading, side: THREE.DoubleSide
      //, side: THREE.DoubleSide//, wireframe: true
    })
    const mesh = this.three.patchesMesh = new THREE.Mesh(geometry, material)
    // mesh.rotation.x = -Math.PI / 2
    this.three.scene.add(mesh)
  }
  initTurtlesMesh () {
    const texture = new THREE.CanvasTexture(this.spriteSheet.ctx.canvas)
    this.spriteSheet.texture = texture

    const vertices = new Float32Array(0)
    const uvs = new Float32Array(0)
    const indices = new Uint32Array(0)
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))
    geometry.name = 'turtles'
    const material = new THREE.MeshBasicMaterial({
      map: texture, alphaTest: 0.5, side: THREE.DoubleSide})

    const mesh = this.three.turtlesMesh = new THREE.Mesh(geometry, material)
    this.three.scene.add(mesh)
  }
  updateTurtlesMesh () {
    // const turtles = this.turtles
    const { vertices, indices } = this.three.unitQuad
    const patchSize = this.world.patchSize
    const mesh = this.three.turtlesMesh
    const positionAttrib = mesh.geometry.getAttribute('position')
    const uvAttrib = mesh.geometry.getAttribute('uv')
    const indexAttrib = mesh.geometry.getIndex()
    // const positions = []
    const positions = new Float32Array(vertices.length * this.turtles.length)
    const uvs = []
    const indexes = []

    for (let i = 0; i < this.turtles.length; i++) {
      const turtle = this.turtles[i]
      const size = turtle.size // * patchSize
      const theta = turtle.theta
      const cos = Math.cos(theta)
      const sin = Math.sin(theta)
      const offset = i * vertices.length

      for (let j = 0; j < vertices.length; j = j + 3) {
        const x0 = vertices[j]
        const y0 = vertices[j + 1]
        const x = turtle.x // * patchSize
        const y = turtle.y // * patchSize
        positions[j + offset] = (size * (x0 * cos - y0 * sin) + x) * patchSize
        positions[j + offset + 1] = (size * (x0 * sin + y0 * cos) + y) * patchSize
        positions[j + offset + 2] = turtle.z * patchSize
      }
      indexes.push(...indices.map((ix) => ix + (i * 4))) // 4
      uvs.push(...turtle.sprite.uvs)
    }
    // positionAttrib.setArray(new Float32Array(positions))
    positionAttrib.setArray(positions)
    positionAttrib.needsUpdate = true
    uvAttrib.setArray(new Float32Array(uvs))
    uvAttrib.needsUpdate = true
    indexAttrib.setArray(new Uint32Array(indexes))
    indexAttrib.needsUpdate = true
  }
  initLinksMesh () {
    const vertices = new Float32Array(0)
    const colors = new Float32Array(0)
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.name = 'links'
    const material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors})

    const mesh = this.three.linksMesh = new THREE.LineSegments(geometry, material)
    this.three.scene.add(mesh)
  }
  updateLinksMesh () {
    const vertices = []
    const colors = []
    for (let i = 0; i < this.links.length; i++) {
      const {end0, end1, color} = this.links[i]
      const {x: x0, y: y0, z: z0} = end0
      const {x: x1, y: y1, z: z1} = end1
      const ps = this.world.patchSize
      vertices.push(x0 * ps, y0 * ps, z0 * ps, x1 * ps, y1 * ps, z1 * ps)
      colors.push(...color.webgl, ...color.webgl)
    }
    const mesh = this.three.linksMesh
    const positionAttrib = mesh.geometry.getAttribute('position')
    const colorAttrib = mesh.geometry.getAttribute('color')
    positionAttrib.setArray(new Float32Array(vertices))
    positionAttrib.needsUpdate = true
    colorAttrib.setArray(new Float32Array(colors))
    colorAttrib.needsUpdate = true
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
      if (force || this.refreshTurtles) {
        // patchesMesh.material.map.needsUpdate = true
        if (this.turtles.length > 0)
          this.updateTurtlesMesh()
      }
      if (force || this.refreshLinks) {
        // patchesMesh.material.map.needsUpdate = true
        if (this.links.length > 0)
          this.updateLinksMesh()
      }

      renderer.render(scene, camera)
    }
    if (this.three.stats) this.three.stats.update()
  }

  // Breeds: create subarrays of Patches, Agentss, Links
  patchBreeds (breedNames) {
    for (const breedName of breedNames.split(' ')) {
      this[breedName] = new Patches(this, PatchProto, breedName, this.patches)
    }
  }
}

export default Model
