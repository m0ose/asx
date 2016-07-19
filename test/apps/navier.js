// Import the lib/ mmodules via relative paths
import ColorMap from 'lib/ColorMap.js'
import Model from 'lib/Model.js'
import util from 'lib/util.js'
import DataSet from 'lib/DataSet.js'
window.pps = util.pps

const modules = { ColorMap, Model, util, pps: util.pps }
util.toWindow(modules)
console.log(Object.keys(modules).join(' '))

class PatchModel extends Model {

  setup () {
    this.BOUNDS_TYPES = {DENSITY: 'DENSITY', 'V': 'V', 'U': 'U'}
    util.error = console.warn
    this.anim.setRate(24)
    this.cmap = ColorMap.Jet
    this.dt = 1
    this.dens = DataSet.emptyDataSet(this.world.numX, this.world.numY, Float64Array)
    this.dens_prev = DataSet.emptyDataSet(this.world.numX, this.world.numY, Float64Array)
    this.u = DataSet.emptyDataSet(this.world.numX, this.world.numY, Float64Array)
    this.v = DataSet.emptyDataSet(this.world.numX, this.world.numY, Float64Array)
    this.u_prev = DataSet.emptyDataSet(this.world.numX, this.world.numY, Float64Array)
    this.v_prev = DataSet.emptyDataSet(this.world.numX, this.world.numY, Float64Array)
    for (const p of this.patches) {
      p.dens = 0
    }
  }

  // do this is order to draw them.
  putDataSetOnPatches (ds, key) {
    for (var p of this.patches) {
      var {minX, minY, maxY} = this.world
      const val = ds.getXY(p.x - minX, maxY - p.y)
      p.dens = val
    }
  }

  step () {
    //
    this.addForces()
    this.addDensity()
    this.velocityStep()
    this.densityStep()
    this.drawStep()
  }

  drawStep () {
    this.putDataSetOnPatches(this.dens, 'dens')
    for (const p of this.patches) {
      p.setColor(this.cmap.scaleColor(p.dens, 0, 1))
    }
    // this.patches.diffuse4('ran', 0.1, this.cmap)
    if (this.anim.ticks >= 300) {
      console.log(this.anim.toString())
      this.stop()
    }
  }

  addDensity () {

  }

  addForces () {
    for (let i = 0; i < 10; i++) {
      this.dens.setXY(32+i, 32, 0.5)
      this.u.setXY(32+i, 32,-5)
      this.v.setXY(32+i, 32, -5)
    }
  }

  densityStep () {
    this.swapDensity()
    this.diffusionStamMethod(this.dens_prev, this.dens)
    // this.dens = this.dens_prev.convolve([0, 1, 0, 1, 2, 1, 0, 1, 0], 1 / 6 * this.dt)
    this.swapDensity()
    this.advect(this.dens_prev, this.dens)
  }

  velocityStep () {
    // add source here
    this.swap('u', 'u_prev')
    //this.u = this.u_prev.convolve([0, 1, 0, 1, 2, 1, 0, 1, 0], 1 / 6 * this.dt)
    this.diffusionStamMethod(this.u_prev, this.u)
    this.swap('v', 'v_prev')
    //this.v = this.v_prev.convolve([0, 1, 0, 1, 2, 1, 0, 1, 0], 1 / 6 * this.dt)
    this.diffusionStamMethod(this.v_prev, this.v)
    this.project()
    this.swap('u', 'u_prev')
    this.swap('v', 'v_prev')
    this.advect(this.u_prev, this.u)
    this.advect(this.v_prev, this.v)
    this.project()
  }

  setBounds (ds, type) {
    if (type == this.BOUNDS_TYPES.DENSITY) {
      for (let i = 0; i < this.dens.width; i++) {
        ds.setXY(i, 0, ds.bilinear(i, 1))
        ds.setXY(i, ds.height - 1, ds.bilinear(i, ds.height - 2))
      }
      for (let j = 0; j < this.dens.height; j++) {
        ds.setXY(0, j, ds.bilinear(1, j))
        ds.setXY(ds.width - 1, j, ds.bilinear(ds.width - 2, j))
      }
    } else if (type === this.BOUNDS_TYPES.V) {
      for (let i = 0; i < this.dens.width; i++) {
        ds.setXY(i, 0, 0)
        ds.setXY(i, ds.height - 1, 0)
      }
    } else if (type === this.BOUNDS_TYPES.U) {
      for (let j = 0; j < this.dens.height; j++) {
        ds.setXY(0, j, 0)
        ds.setXY(ds.width - 1, j, 0)
      }
    }
  }

  swapDensity () {
    this.swap('dens', 'dens_prev')
  }

  swapVelocities () {
    this.swap('u', 'u_prev')
    this.swap('v', 'v_prev')
  }

  swap (key1, key2) {
    const tmp = this[key1]
    this[key1] = this[key2]
    this[key2] = tmp
  }

  advect (X0, X) {
    for (var i = 0; i < X.width; i++) {
      for (var j = 0; j < X.height; j++) {
        var dudt = this.u.getXY(i, j) * (-this.dt)
        var dvdt = this.v.getXY(i, j) * (-this.dt)
        var x2 = dudt + i
        var y2 = dvdt + j
        if (X.inBounds(x2, y2)) {
          var val = X0.bilinear(x2, y2)
          X.setXY(i, j, val)
        } else {
          X.setXY(i, j, 0)
        }
      }
    }
  }

  project () {
    const p = this.u_prev//DataSet.emptyDataSet(this.u.width, this.u.height, Float64Array)
    const div = this.v_prev//DataSet.emptyDataSet(this.u.width, this.u.height, Float64Array)
    const U = this.u
    const V = this.v
    const h = 0.5 * Math.hypot(U.width, U.height)
    for (let i = 1; i < U.width - 1; i++) {
      for (let j = 1; j < U.height - 1; j++) {
        var gradX = U.getXY(i + 1, j) - U.getXY(i - 1, j)
        var gradY = V.getXY(i, j + 1) - V.getXY(i, j - 1)
        div.setXY(i, j, h * (gradX + gradY))
        p.setXY(i, j, 0)
      }
    }
    this.setBounds(div, this.BOUNDS_TYPES.V)
    this.setBounds(p, this.BOUNDS_TYPES.U)
    //
    for (let k = 0; k < 20; k++) {
      for (let i = 1; i < U.width - 1; i++) {
        for (let j = 1; j < U.height - 1; j++) {
          var val = (div.getXY(i, j) + p.getXY(i - 1, j) + p.getXY(i + 1, j) + p.getXY(i, j - 1) + p.getXY(i, j + 1)) / 4
          p.setXY(i, j, val)
        }
      }
      this.setBounds(p, this.BOUNDS_TYPES.U)
    }
    const wScale = 0.5 / U.width
    const hScale = 0.5 / U.height
    for (let i = 1; i < U.width - 1; i++) {
      for (let j = 1; j < U.height - 1; j++) {
        var pdx = p.getXY(i + 1, j) - p.getXY(i - 1, j)
        var pdy = p.getXY(i, j + 1) - p.getXY(i, j - 1)
        var v1 = U.getXY(i, j) - wScale * pdx
        var v2 = V.getXY(i, j) - hScale * pdy
        U.setXY(i, j, v1)
        V.setXY(i, j, v2)
      }
    }
    this.setBounds(U, this.BOUNDS_TYPES.U)
    this.setBounds(V, this.BOUNDS_TYPES.V)
  }

  //
  // this is the diffuse step from the paper. Stam, Jos
  //
  diffusionStamMethod (D0, D, diff = 1) {
    const a = this.dt * diff
    for (var k = 0; k < 20; k++) {
      for (var i = 1; i < D.width - 1; i++) {
        for (var j = 1; j < D.height - 1; j++) {
          const val = (D0.getXY(i, j) +
                  a * (
                    D.getXY(i - 1, j) +
                    D.getXY(i + 1, j) +
                    D.getXY(i, j - 1) +
                    D.getXY(i, j + 1)
                  )) / (1 + 4 * a)
          D.setXY(i, j, val)
        }
      }
      this.setBounds(D, this.BOUNDS_TYPES.DENSITY)
    }
  }
}

// const [div, size, max, min] = ['layers', 4, 50, -50]
const [div, size, max, min] = ['layers', 10, 32, -32]
const opts =
  {patchSize: size, minX: min, maxX: max, minY: min, maxY: max}
const model = new PatchModel(div, opts)
model.start()

// debugging
const world = model.world
const patches = model.patches
util.toWindow({ model, world, patches, p: patches.oneOf() })
if (size !== 1) util.addToDom(patches.pixels.ctx.canvas)

// const jetColorMap = ColorMap.Jet
// const jetCtx = util.createCtx()
// class JetModel extends Model {
//   setup () {
//
//
//     this.cmap = ColorMap.rgbColorCube(8, 8, 4)
//     for (const p of this.patches) {
//       p.ran = util.randomFloat(1.0)
//     }
//   }
// }
// jetModel = new JetModel({patchSize: 1, minX: 1, maxX: 256, minY: 0, maxY: 0})
