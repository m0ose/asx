// Import the lib/ mmodules via relative paths
import ColorMap from 'lib/ColorMap.js'
import Model from 'lib/Model.js'
import util from 'lib/util.js'
import TileDataSet from 'lib/TileDataSet.js'
import NavierSim from './NavierSim.js'
import Mouse from 'lib/Mouse.js'

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
    this.sim.seaLevel = 0
    this.updateBoundaries()
    //
    this.firstMousePos
    this.mouse = new Mouse(this, true, (evt) => {
      const M = this.mouse
      console.log(M.down, M.moved)
      if (M.down) {
        if (M.moved) {
          let Mnow = [Math.round(M.x), this.world.maxY - Math.round(M.y)]
          let dM = [Mnow[0] - this.firstMousePos[0], Mnow[1] - this.firstMousePos[1]]
          let p = model.patches.patchXY(this.firstMousePos[0], this.firstMousePos[1])
          // console.log(M, M.x, M.y)
          let [pX2, pY2] = [Math.round(p.x/5)*5, Math.round(p.y/5)*5]
          if (Math.hypot(dM[0], dM[1]) > 3) {
            this.sim.u_static.setXY(pX2, pY2, dM[0])
            this.sim.v_static.setXY(pX2, pY2, dM[1])
          } else {
            this.sim.u_static.setXY(pX2, pY2, 0)
            this.sim.v_static.setXY(pX2, pY2, 0)
          }
        } else {
          this.firstMousePos = [Math.round(M.x), this.world.maxY - Math.round(M.y)]
        }
      } else {
        this.firstMousePos = undefined
      }
    })
    this.mouse.start()
  }

  updateBoundaries () {
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
    // vector
    const ctx = this.contexts.drawing
    const W = this.world
    ctx.clearRect(W.minX, W.minY, W.maxX - W.minX, W.maxY - W.minY)
    ctx.beginPath()
    ctx.strokeStyle="#000000"
    for (let p of this.patches) {
      if (p.x % 5 === 0 && p.y % 5 === 0) {
        let u = this.sim.u.data[p.id]
        let v = this.sim.v.data[p.id]
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + u, p.y - v)
      }
    }
    ctx.stroke()
    ctx.closePath()
    // static vectors
    ctx.beginPath()
    ctx.strokeStyle="#FF0000"
    for (let p of this.patches) {
      let u = this.sim.u_static.data[p.id]
      let v = this.sim.v_static.data[p.id]
      let mag = Math.hypot(u,v)
      if (mag > 0) {
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + u, p.y - v)
      }
    }
    ctx.stroke()
    ctx.closePath()
  }
}
// const [div, size, max, min] = ['layers', 4, 50, -50]
const opts = {patchSize: 4, minX: 0, maxX: 128, minY: 0, maxY: 128}
const model = new NavierDisplay('layers', opts)
model.start()

// debugging
util.toWindow({ model })
