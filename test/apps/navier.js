// Import the lib/ mmodules via relative paths
import ColorMap from 'lib/ColorMap.js'
import Model from 'lib/Model.js'
import util from 'lib/util.js'
import TileDataSet from 'lib/TileDataSet.js'
import NavierSim from './NavierSim.js'

class NavierDisplay extends Model {
  startup () {
    return this.loadElevations()
  }

  loadElevations (north = 60.0, south = 59.29, east = -151.37, west = -152.58) {
    return new Promise((resolve, reject) => {
      const ds = new TileDataSet({
        north: north,
        south: south,
        west: west,
        east: east,
        debug: true,
        callback: (err, val) => {
          if (!err) {
            this.elevation = val
            resolve(val)
          }
          else {
            reject(err)
          }
        }
      })
    })
  }

  setup () {
    console.log(' main setup called', this)
    util.error = console.warn
    this.anim.setRate(24)
    this.cmap = ColorMap.Jet
    this.sim = new NavierSim(this.world.numX, this.world.numY)
    // boundaries
    this.sim.seaLevel = 0
    model.patches.importDataSet(this.elevation, 'elev', true)
    for (let p of this.patches) {
      this.sim.boundaries.data[p.id] = 1 * (p.elev > this.sim.seaLevel)
    }
  }

  step () {
    this.sim.step()
    this.putTypedArrayOnPatches()
    this.drawStep()
    this.stepCount ++
    if (this.stepCount % 30 === 0) {
      const now = new Date().getTime()
      const elapsed = (now - this.startTime) / 1000
      console.log(`model in worker steps/sec: ${this.stepCount / elapsed}, queue length: ${messageQueue.length}`)
    }
  }

  // do this is order to draw them.
  putTypedArrayOnPatches () {
    for (let p of this.patches) {
      p.dens = this.sim.dens.data[p.id]
      if (this.sim.boundaries.data[p.id] > 0.0) {
        p.dens = 4.0
      }
    }
  }

  drawStep () {
    for (const p of this.patches) {
      p.setColor(this.cmap.scaleColor(p.dens || 0, 0, 1))
    }
  }
}
// const [div, size, max, min] = ['layers', 4, 50, -50]
const opts = {patchSize: 4, minX: -64, maxX: 64, minY: -64, maxY: 64}
const model = new NavierDisplay('layers', opts)
model.start()

// debugging
util.toWindow({ model })
