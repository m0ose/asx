// A naive implementation of turtles, one mesh per turtle
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
const turtleSize = 2
const turtleZ = patchSize / 4
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

let turtleGeometry = new THREE.Geometry()
// const turtles = turtleGeometry.vertices
const turtleMaterial = // side: THREE.DoubleSide .. not needed, billboard
  new THREE.PointsMaterial({size: turtleSize, color: 'red'})
let turtleMesh = new THREE.Points(turtleGeometry, turtleMaterial)
scene.add(turtleMesh)
function createTurtles (num) {
  // num = num - turtles.length
  // if (num < 0)
  //   turtleGeometry.vertices.length += num
  // else
    util.repeat(num, () => {
      const vec = new THREE.Vector3(0, 0, turtleZ)
      vec.theta = 2 * Math.PI * Math.random()
      turtleGeometry.vertices.push(vec)
      // turtleGeometry.vertices.push(vec)
    })
}
// let turtles = createTurtles(UI.KTurtles * 1e3)
createTurtles(UI.KTurtles * 1e3)
util.toWindow({turtleGeometry, turtleMaterial})

// Animator & Events
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const speed = patchSize / 10
function step () {
  util.forEach(turtleGeometry.vertices, (turtle) => {
    const wiggle = Math.random() > 0.9 ? util.randomFloat2(-0.1, 0.1) : 0
    const theta = turtle.theta + wiggle
    let dx = speed * Math.cos(theta) // Cody: 1-2fps better w/o destructuring
    let dy = speed * Math.sin(theta)
    const x0 = turtle.x // no obvious advantage over destructuring
    const y0 = turtle.y
    const x = THREE.Math.clamp(x0 + dx, -worldRadius, worldRadius)
    const y = THREE.Math.clamp(y0 + dy, -worldRadius, worldRadius)
    if (Math.abs(x) === worldRadius) dx = -dx
    if (Math.abs(y) === worldRadius) dy = -dy
    turtle.x = x + dx
    turtle.y = y + dy
    turtle.theta = Math.atan2(dy, dx)
  })
  turtleGeometry.verticesNeedUpdate = true
}

function animate () {
  requestAnimationFrame(animate)
  step()
  renderer.render(scene, camera)
  stats.update()
  // controls.update()  // have the mouse update the view
}
animate()
console.log('render info', renderer.info.render)

const gui = new dat.GUI()
function resetTurtles () {
  scene.remove(turtleMesh)
  turtleGeometry = new THREE.Geometry()
  turtleMesh = new THREE.Points(turtleGeometry, turtleMaterial)
  createTurtles(UI.KTurtles * 1e3)
  scene.add(turtleMesh)
}
gui.add(UI, 'KTurtles', 1, 100).step(1).onFinishChange(resetTurtles)
util.toWindow({UI, gui})
