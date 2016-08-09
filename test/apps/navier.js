// Import the lib/ mmodules via relative paths
import ColorMap from 'lib/ColorMap.js'
import Color from 'lib/Color.js'
import Model from 'lib/Model.js'
import util from 'lib/util.js'
import TileDataSet from 'lib/TileDataSet.js'
import NavierSim from './NavierSim.js'
import Mouse from 'lib/Mouse.js'

class NavierDisplay extends Model {
  startup () {
    return this.loadElevations()
  }

  // ak coast north = 60.0, south = 59.29, east = -151.37, west = -152.58
  loadElevations (north = 60.0, south = 59.29, east = -151.37, west = -152.58) {
    return new Promise((resolve, reject) => {
      const ds = new TileDataSet({
        // url: 'https://s3-us-west-2.amazonaws.com/simtable-elevation-tiles/{z}/{x}/{y}.png',
        north: north,
        south: south,
        west: west,
        east: east,
        maxZoom: 13,
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
    this.mouseThreshold = 5
    this.updateBoundaries()
    //
    this.firstMousePos
    this.mouse = new Mouse(this, true, (evt) => {
      const brect = evt.div.getBoundingClientRect()
      const [x,y] = [evt.event.clientX - brect.left, evt.event.clientY - brect.top]
      let [px3, py3] = [x * this.world.numX / brect.width, y * this.world.numY / brect.height]
      px3 = Math.round(px3)
      py3 = Math.round(py3)
      this.onMouse(evt, px3, py3)
    })
    this.mouse.start()
  }

  onMouse (evt, x, y) {
    this.onMouse_Vector(evt, x, y)
  }

  onMouse_Vector (evt, x, y) {
    if (evt.down) {
      if (evt.moved) {
        let Mnow = [x, y]
        let dM = [Mnow[0] - this.firstMousePos[0], Mnow[1] - this.firstMousePos[1]]
        let p = this.patches.patchXY(this.firstMousePos[0], this.firstMousePos[1])
        // round patches to nearest 5
        let [pX2, pY2] = [Math.round(p.x/5)*5, Math.round(p.y/5)*5]
        // if there is less then the threshold set to 0
        if (Math.hypot(dM[0], dM[1]) > this.mouseThreshold) {
          this.sim.u_static.setXY(pX2, pY2, dM[0])
          this.sim.v_static.setXY(pX2, pY2, dM[1])
        } else {
          this.sim.u_static.setXY(pX2, pY2, 0)
          this.sim.v_static.setXY(pX2, pY2, 0)
        }
      } else {
        this.firstMousePos = [x, y]
      }
    } else {
      this.firstMousePos = undefined
    }
  }

  onMouse_Particle (evt, x, y) {
    if (evt.down) {
      let p = this.patches.patchXY(x, y)
      let nei = this.patches.patchRect(p, 6, 6)
      for (let p2 of nei) {
        if (Math.random() > 0.9) {
          this.sim.addParticle(p2.x, p2.y)
        }
      }
    }
  }

  updateBoundaries () {
    model.patches.importDataSet(this.elevation, 'elev', true)
    this.sim.resetFields()
    for (let p of this.patches) {
      this.sim.boundaries.data[p.id] = 1 * (p.elev > this.sim.seaLevel)
    }
  }

  step () {
    this.addDensity()
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

  addDensity () {
    for (let p of this.patches) {
      if (this.sim.u_static.data[p.id] !== 0 || this.sim.v_static.data[p.id] !== 0) {
        let nei = this.patches.inRect(p, 2, 2)
        for (let n of nei) {
          this.sim.dens.data[n.id] = 0.3
        }
      }
    }
  }

  // do this is order to draw them.
  putTypedArrayOnPatches () {
    for (let p of this.patches) {
      p.dens = this.sim.dens.data[p.id]
      p.isBoundary = false
      if (this.sim.boundaries.data[p.id] > 0.0) {
        p.isBoundary = true
      }
    }
  }

  drawStep () {
    for (const p of this.patches) {
      p.setColor(this.cmap.scaleColor(p.dens || 0, 0, 1))
      if (p.isBoundary) {
        p.setColor(this.cmap.scaleColor(1, 0, 1))
      }
    }
    // vector
    const ctx = this.contexts.drawing
    ctx.lineWidth = 0.5
    const W = this.world
    ctx.clearRect(W.minX, W.minY, W.maxX - W.minX, W.maxY - W.minY)
    ctx.beginPath()
    ctx.strokeStyle="#909900"
    for (let p of this.patches) {
      if (p.x % 5 === 0 && p.y % 5 === 0) {
        let u = 2 * this.sim.u.data[p.id] //scale by 2
        let v = 2 * this.sim.v.data[p.id]
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
        this.canvasArrow(ctx, p.x, p.y, p.x + u, p.y - v)
      }
    }
    ctx.stroke()
    ctx.closePath()
    //
    // draw particles
    ctx.strokeStyle="#00ff00"
    ctx.fillStyle="#00ff00"
    for (let j = 0; j < this.sim.particles.length; j++) {
      let pa = this.sim.particles[j]
      const [x4, y4] = [pa[0], this.world.maxY - pa[1]]
      ctx.fillRect(x4, y4, 1, 1)
    }
  }

  canvasArrow (ctx, fromx, fromy, tox, toy) {
    const headlen = 2   // length of head in pixels
    const angle = Math.atan2(toy - fromy, tox - fromx)
    ctx.moveTo(fromx, fromy)
    ctx.lineTo(tox, toy)
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6))
    ctx.moveTo(tox, toy)
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6))
  }
}
// const [div, size, max, min] = ['layers', 4, 50,  - 50]
const opts = {patchSize: 4, minX: 0, maxX: 128, minY: 0, maxY: 128}
const model = new NavierDisplay('layers', opts)
model.start()

export default model
// debugging
util.toWindow({ model })
