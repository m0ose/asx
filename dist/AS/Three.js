import SpriteSheet from './SpriteSheet.js'
import util from './util.js'

// import THREE from '../libs/three.wrapper.js'
// import * as THREE from 'http://backspaces.github.io/asx/libs/three.module.js'
// import * as THREE from '../libs/src/three/Three.js'
// import OrbitControls from '../libs/OrbitControls.module.js'
// import Stats from '../libs/Stats.js'
// import dat from '../libs/dat.gui.module.js'
// import GUI from '../libs/src/dat.gui/dat/gui/GUI.js'

class Three {
  static defaultOptions (useThreeHelpers = true, useUIHelpers = true) {
    return {
    // include me in options so Model can instanciate me!
      Renderer: Three,
      orthoView: false,             // 'Perspective', 'Orthographic'
      clearColor: 0x000000,         // clear to black
      useAxes: useThreeHelpers,     // show x,y,z axes
      useGrid: useThreeHelpers,     // show x,y plane
      useControls: useThreeHelpers, // activate navigation. REMIND: name of control?
      useStats: useUIHelpers,       // show fps widget
      useGUI: useUIHelpers          // activate dat.gui UI
    }
  }

  // The Model constructor takes a DOM div and overrides for defaults
  constructor (model, options = {}) {
    this.model = model
    this.spriteSheet = new SpriteSheet()

    // Initialize options
    Object.assign(this, Three.defaultOptions) // install defaults
    Object.assign(this, options) // override defaults
    if (this.Renderer !== Three)
      throw Error('Three ctor: Renderer not Three', this.renderer)

    // Initialize Three.js
    this.initThree()
    this.initThreeHelpers()

    this.unitQuad = this.createQuad(0.5, 0)
  }
  createQuad (r, z = 0) { // r is radius of xy quad: [-r,+r], z is quad z
    const vertices = [-r, -r, z, r, -r, z, r, r, z, -r, r, z]
    const indices = [0, 1, 2, 0, 2, 3]
    return {vertices, indices}
  }
  // Init Three.js core: scene, camera, renderer
  initThree () {
    const {clientWidth, clientHeight} = this.model.div
    const {orthoView, clearColor} = this
    const {width, height} = this.model.world
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
    this.model.div.appendChild(renderer.domElement)

    window.addEventListener('resize', () => {
      const {clientWidth, clientHeight} = this.model.div
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    })

    Object.assign(this, {scene, camera, renderer})
  }
  initThreeHelpers () {
    const {scene, renderer, camera} = this
    const {useAxes, useGrid, useControls, useStats, useGUI} = this
    const {width} = this.model.world
    const helpers = {}

    if (useAxes) {
      helpers.axes = new THREE.AxisHelper(1.5 * width / 2)
      scene.add(helpers.axes)
    }
    if (useGrid) {
      helpers.grid = new THREE.GridHelper(1.25 * width, 10)
      helpers.grid.rotation.x = THREE.Math.degToRad(90)
      scene.add(helpers.grid)
    }
    if (useControls) {
      helpers.controls = new THREE.OrbitControls(camera, renderer.domElement)
      // helpers.controls = OrbitControls // REMIND: legacy vs modules
      //   ? new OrbitControls(camera, renderer.domElement)
      //   : new THREE.OrbitControls(camera, renderer.domElement)
    }
    if (useStats) {
      helpers.stats = new Stats()
      // This does not work: helpers.stats.dom.style.position = 'absolute'
      document.body.appendChild(helpers.stats.dom)
    }
    if (useGUI) {
      helpers.gui = new dat.GUI() // auto adds to body, appendChild not needed
    }

    Object.assign(this, helpers)
  }
  disposeThreeMesh (mesh) {
    if (mesh.parent !== this.scene) console.log('mesh parent not scene')
    mesh.parent.remove(mesh)
    mesh.geometry.dispose()
    mesh.material.dispose()
    if (mesh.material.map) mesh.material.map.dispose()
  }

  // Canvas Meshes are generalized Canvas 2D Textures.
  // Note: You may want to use a PowerOfTwo canvas to avoid constraints
  //   canvas.width = util.nextPowerOf2(canvas.width)
  //   canvas.height = util.nextPowerOf2(canvas.height)
  initCanvasMesh (canvas, name, z, textureOptions = {}) {
    if (this[name]) this.disposeThreeMesh(this[name])
    const {width, height, numX, numY} = this.model.world

    const texture = new THREE.CanvasTexture(canvas)
    if (!util.isPowerOf2(canvas.width) || !util.isPowerOf2(canvas.height)) {
      // Can be Linear. Also wrap params could be clamp to edge
      // See MDN: https://goo.gl/JBH1I9
      texture.minFilter = THREE.NearestFilter
      texture.magFilter = THREE.NearestFilter
    }
    // Can override above.
    Object.assign(texture, textureOptions)

    const geometry = new THREE.PlaneGeometry(width, height, numX, numY)

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      transparent: true
    })

    const mesh = this[name] = new THREE.Mesh(geometry, material)
    mesh.position.z = z
    this.scene.add(mesh)
  }
  updateCanvasMesh (name) {
    this[name].material.map.needsUpdate = true
  }

  // Patch meshes are a form of Canvas Mesh
  initPatchesMesh (canvas) {
    this.initCanvasMesh(canvas, 'patchesMesh', 0)
  }
  updatePatchesMesh (patches) {
    patches.installPixels()
    this.patchesMesh.material.map.needsUpdate = true
  }

  initPointsMesh (name, pointSize = 0.3, z = 0, color = null) {
    if (this[name]) this.disposeThreeMesh(this[name])

    pointSize = pointSize * this.model.world.patchSize

    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position',
      new THREE.BufferAttribute(new Float32Array(), 3))
    if (color == null)
      geometry.addAttribute('color',
        new THREE.BufferAttribute(new Float32Array(), 3))

    const material = new THREE.PointsMaterial({
      size: pointSize, vertexColors: THREE.VertexColors
    })
    if (color != null) material.color = color.webgl || color

    const mesh = this[name] = new THREE.Points(geometry, material)
    mesh.position.z = z
    this.scene.add(mesh)
  }
  updatePointsMesh (name, turtles) {
    const mesh = this[name]
    const positionAttrib = mesh.geometry.getAttribute('position')
    // const positionBuff = positionAttrib.array
    const colorAttrib = mesh.geometry.getAttribute('color')
    const vertices = []
    const colors = colorAttrib == null ? null : []
    const patchSize = this.model.world.patchSize

    const red = [1, 0, 0] // REMIND: add color/shape to turtles

    for (let i = 0; i < turtles.length; i++) {
      const turtle = turtles[i]
      vertices.push(turtle.x * patchSize, turtle.y * patchSize, turtle.z * patchSize)
      if (colors != null) colors.push(...red)
    }
    positionAttrib.setArray(new Float32Array(vertices))
    positionAttrib.needsUpdate = true
    if (colors) {
      colorAttrib.setArray(new Float32Array(colors))
      colorAttrib.needsUpdate = true
    }
  }

  // initTurtlesMesh (name) {
  initQuadSpriteMesh (name) {
    // if (this.turtlesMesh) this.disposeThreeMesh(this.turtlesMesh)
    if (this[name]) this.disposeThreeMesh(this[name])

    const texture = new THREE.CanvasTexture(this.spriteSheet.ctx.canvas)
    this.spriteSheet.texture = texture

    const vertices = new Float32Array()
    const uvs = new Float32Array()
    const indices = new Uint32Array()
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))
    const material = new THREE.MeshBasicMaterial({
      map: texture, alphaTest: 0.5, side: THREE.DoubleSide})

    // geometry.name = 'turtles'
    const mesh = this[name] = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
  }
  // updateTurtlesMesh (name, turtles) {
  updateQuadSpriteMesh (name, turtles) {
    const mesh = this[name]
    const { vertices, indices } = this.unitQuad
    const patchSize = this.model.world.patchSize
    // const mesh = this.turtlesMesh
    const positionAttrib = mesh.geometry.getAttribute('position')
    const uvAttrib = mesh.geometry.getAttribute('uv')
    const indexAttrib = mesh.geometry.getIndex()
    // const positions = []
    const positions = new Float32Array(vertices.length * turtles.length)
    const uvs = []
    const indexes = []

    for (let i = 0; i < turtles.length; i++) {
      const turtle = turtles[i]
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
    if (this.linksMesh) this.disposeThreeMesh(this.linksMesh)
    const vertices = new Float32Array(0)
    const colors = new Float32Array(0)
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))
    // geometry.name = 'links'
    const material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors})

    const mesh = this.linksMesh = new THREE.LineSegments(geometry, material)
    this.scene.add(mesh)
  }
  updateLinksMesh (links) {
    const vertices = []
    const colors = []
    for (let i = 0; i < links.length; i++) {
      const {end0, end1, color} = links[i]
      const {x: x0, y: y0, z: z0} = end0
      const {x: x1, y: y1, z: z1} = end1
      const ps = this.model.world.patchSize
      vertices.push(x0 * ps, y0 * ps, z0 * ps, x1 * ps, y1 * ps, z1 * ps)
      colors.push(...color.webgl, ...color.webgl)
    }
    const mesh = this.linksMesh
    const positionAttrib = mesh.geometry.getAttribute('position')
    const colorAttrib = mesh.geometry.getAttribute('color')
    positionAttrib.setArray(new Float32Array(vertices))
    positionAttrib.needsUpdate = true
    colorAttrib.setArray(new Float32Array(colors))
    colorAttrib.needsUpdate = true
  }

  initTurtlesMesh () {
    if (this.turtlesMesh) this.disposeThreeMesh(this.turtlesMesh)

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

    const mesh = this.turtlesMesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
  }
  updateTurtlesMesh (turtles) {
    // const turtles = this.turtles
    const { vertices, indices } = this.unitQuad
    const patchSize = this.model.world.patchSize
    const mesh = this.turtlesMesh
    const positionAttrib = mesh.geometry.getAttribute('position')
    const uvAttrib = mesh.geometry.getAttribute('uv')
    const indexAttrib = mesh.geometry.getIndex()
    // const positions = []
    const positions = new Float32Array(vertices.length * turtles.length)
    const uvs = []
    const indexes = []

    for (let i = 0; i < turtles.length; i++) {
      const turtle = turtles[i]
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
}

export default Three
