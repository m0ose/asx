// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import * as THREE from 'etc/three.min.js'
import OrbitControls from 'etc/threelibs/OrbitControls.js'
import Stats from 'etc/stats.min.js'
import dat from 'etc/dat.gui.min.js'

// const modules = { Color, ColorMap, Model, util, THREE }
const modules = { THREE, OrbitControls, Stats, dat, util }
util.toWindow(modules)
console.log(Object.keys(modules).join(', '))

// const numTurtles = 5e3 // N k turtles
const UI = {
  KTurtles: 10
}
const worldWidth = 200 // -100 -> 100
const worldRadius = worldWidth / 2
const patchSize = 10
// const patches = worldWidth / patchSize

function initThree () {
  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor('rgb(240, 240, 240)')
  document.body.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const axes = new THREE.AxisHelper(1.1 * worldRadius)
  scene.add(axes)
  const grid = new THREE.GridHelper(worldWidth, worldWidth / patchSize)
  grid.rotation.x = THREE.Math.degToRad(90)
  scene.add(grid)

  const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
  )
  camera.position.x = worldWidth
  camera.position.y = -worldWidth
  camera.position.z = worldWidth
  camera.lookAt(scene.position)
  camera.up.set(0, 0, 1)
  // camera.up = [0,0,1] // As of r.50, the camera no longer needs to be added to the scene
  const controls = new OrbitControls(camera, renderer.domElement)

  const stats = new Stats()
  document.body.appendChild(stats.dom)

  util.toWindow({grid, axes})
  return {scene, camera, renderer, controls, stats}
}

const {scene, camera, renderer, controls, stats} = initThree()
util.toWindow({scene, camera, renderer, controls, stats})

// Models/Turtles

function createTurtleGeometry (size = 1) {
  const radius = size / 2
  const turtleGeometry = new THREE.Geometry()
  turtleGeometry.vertices = [
    new THREE.Vector3(radius, 0, 0),
    new THREE.Vector3(-radius, radius * 0.8, 0),
    new THREE.Vector3(-radius * 0.4, 0, 0),
    new THREE.Vector3(-radius, -radius * 0.8, 0)
  ]
  turtleGeometry.faces = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 2, 3)
  ]
  turtleGeometry.computeFaceNormals()
  return turtleGeometry
}
const turtleGeometry = new // 1 fps faster
  THREE.BufferGeometry().fromGeometry(createTurtleGeometry(2))
// const turtleGeometry = createTurtleGeometry(2)
// 1-2fps cost for double sided
const turtleMaterial =
  // new THREE.MeshBasicMaterial({color: 'red'})
  new THREE.MeshBasicMaterial({color: 'red', side: THREE.DoubleSide})
function createTurtle () {
  const turtle = new THREE.Mesh(turtleGeometry, turtleMaterial)
  // turtle.scale.x = 2 // patchSize
  // turtle.scale.y = 2 // patchSize
  turtle.position.x = 0
  turtle.position.y = 0
  turtle.position.z = patchSize / 4
  turtle.rotation.z = util.randomFloat(2 * Math.PI) // THREE.Math.degToRad(45)
  return turtle
}
function createTurtles (num) {
  return util.repeat(num, (i, a) => {
    a[i] = createTurtle()
    scene.add(a[i])
 })
}
let turtles = createTurtles(UI.KTurtles * 1e3)
util.toWindow({turtleGeometry, turtleMaterial, turtles})

// Animator & Events
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const speed = patchSize / 10
function step () {
  util.forEach(turtles, (turtle) => {
    const wiggle = Math.random() > 0.9 ? util.randomFloat2(-0.1, 0.1) : 0
    const theta = turtle.rotation.z + wiggle
    // let [dx, dy] = [speed * Math.cos(theta), speed * Math.sin(theta)]
    let dx = speed * Math.cos(theta) // Cody: 1-2fps better w/o destructuring
    let dy = speed * Math.sin(theta)
    // const {x: x0, y: y0} = turtle.position
    const x0 = turtle.position.x // no obvious advantage over destructuring
    const y0 = turtle.position.y
    const x = THREE.Math.clamp(x0 + dx, -worldRadius, worldRadius)
    const y = THREE.Math.clamp(y0 + dy, -worldRadius, worldRadius)
    if (Math.abs(x) === worldRadius) dx = -dx
    if (Math.abs(y) === worldRadius) dy = -dy
    turtle.position.x = x
    turtle.position.y = y
    turtle.rotation.z = Math.atan2(dy, dx)
  })
}

function animate () {
  requestAnimationFrame(animate)
  step()
  renderer.render(scene, camera)
  stats.update()
  // controls.update()  // have the mouse update the view
}
animate()

const gui = new dat.GUI()
function resetTurtles () {
  turtles.forEach((turtle) => scene.remove(turtle))
  turtles = createTurtles(UI.KTurtles * 1e3)
  util.toWindow({turtles})
}
gui.add(UI, 'KTurtles', 1, 50).step(1).onFinishChange(resetTurtles)
util.toWindow({UI, gui})
