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
    util.error = console.warn
    this.anim.setRate(60)
    this.cmap = ColorMap.Rgb256
    this.dt = 0.01
    this.dens = DataSet.emptyDataSet(this.world.numX, this.world.numY, Float64Array)
    this.dens_prev = DataSet.emptyDataSet(this.world.numX, this.world.numY, Float64Array)
    for (var i = 0; i < this.dens.data.length; i++) {
      this.dens.data[i] = Math.random()
      this.dens_prev.data[i] = this.dens.data[i]
    }
    // this.cmap = ColorMap.Jet
    for (const p of this.patches) {
      p.dens = 0.0
      p.v = 0.0
      p.u_prev = 0.0
      p.v_prev = 0.0
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
    console.log('.')
    // diffuse densities
    // this.patches.diffuse('dens', 0.1 * this.dt, this.cmap)
    this.dens = this.dens.convolve([0,1,0, 1,2,1, 0,1,0], 1/6)
    // this.diffuseStamMethod()
    // this.setBounds(this.dens)
    // this.setBounds(this.dens_prev)

    let tmp = this.dens_prev
    //this.dens_prev = this.dens
    //this.dens = tmp
    //this.advect()
    // goes at end
    // update prev values
    this.putDataSetOnPatches(this.dens, 'dens')
    for (const p of this.patches) {
      p.setColor(this.cmap.scaleColor(p.dens, 0, 1))
    }
    // this.patches.diffuse4('ran', 0.1, this.cmap)
    if (this.anim.ticks === 30) {
      console.log(this.anim.toString())
      this.stop()
    }
  }

  diffuseStamMethod (diff = 1) {
    const d = this.dens
    const d0 = this.dens_prev
    const a = this.dt * d.width * d.height * diff
    for (var k = 0; k < 20; k++) {
      for (var i = 1; i < d.width - 1; i++) {
        for (var j = 1; j < d.width - 1; j++) {
          const val = (d0.getXY(i, j) + a * (d.getXY(i - 1, j) +
                  d.getXY(i + 1, j) + d.getXY(i, j - 1) +
                  d.getXY(i, j + 1))) / (1 + 4 * a)
          d.setXY(i, j, val)
        }
      }
    }
  }

  setBounds (ds) {
    for (var i = 0; i < this.dens.width; i++) {
      ds.setXY(i, 0, ds.sample(i, 1))
      ds.setXY(i, ds.height - 1, ds.sample(i, ds.height - 2))
    }
    for (var j = 0; j < this.dens.height; j++) {
      ds.setXY(0, j, ds.sample(1, j))
      ds.setXY(ds.width - 1, j, ds.sample(ds.width - 2, j))
    }
  }

  advect () {
    /*for (const p of this.patches) {
      const vel = [p.u, p.v].map((a) => { return a / -this.dt }) // -[u,v]/dt
      const pos2 = [vel[0] + p.x, vel[1] + p.y]
      try {
        p.dens = this.bilinearSample(pos2[0], pos2[1], 'dens_prev')
      } catch (err) {
        console.error(p, p.x, p.y, err)
        return
      }
    }
    */
  }
}

// const [div, size, max, min] = ['layers', 4, 50, -50]
const [div, size, max, min] = ['layers', 2, 100, -100]
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
