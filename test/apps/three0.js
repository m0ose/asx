// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import * as THREE from 'etc/three.min.js'
import OrbitControls from 'etc/threelibs/OrbitControls.js'

// const modules = { Color, ColorMap, Model, util, THREE }
const modules = { THREE, OrbitControls, util }
util.toWindow(modules)
console.log(Object.keys(modules).join(', '))

const worldWidth = 200 // -100 -> 100
const patches = 20
const patchSize = 10

function initThree () {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor('rgb(240, 240, 240)')
  document.body.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  // scene.rotation.x = -Math.PI / 2
  const axes = new THREE.AxisHelper(1.1 * worldWidth)
  // axes.rotation.x = Math.PI / 2
  scene.add(axes)
  const grid = new THREE.GridHelper(worldWidth, patches)
  grid.rotation.x = Math.PI / 2
  // grid.position.y = -0.01
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

  util.toWindow({grid, axes})
  return {scene, camera, renderer, controls}
}

const {scene, camera, renderer, controls} = initThree()
util.toWindow({scene, camera, renderer, controls})

// Models/Turtles
const turtleGeometry = new THREE.Geometry()
turtleGeometry.vertices = [
  new THREE.Vector3(0.5, 0, 0),
  new THREE.Vector3(-0.5, 0.4, 0),
  new THREE.Vector3(-0.2, 0, 0),
  new THREE.Vector3(-0.5, -0.4, 0)
]
turtleGeometry.faces = [
  new THREE.Face3(0, 1, 2),
  new THREE.Face3(0, 2, 3)
]
turtleGeometry.computeFaceNormals()
const turtleMaterial =
  new THREE.MeshBasicMaterial({color: 'red', side: THREE.DoubleSide})
const turtle = new THREE.Mesh(turtleGeometry, turtleMaterial)
turtle.scale.x = patchSize
turtle.scale.y = patchSize
turtle.position.x = patchSize
turtle.position.y = patchSize
turtle.position.z = patchSize
// turtle.rotation.x = -0.5 * Math.PI
util.toWindow({turtleGeometry, turtleMaterial, turtle})

scene.add(turtle)

// Animator & Events
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  // controls.update()  // have the mouse update the view
}
animate()
