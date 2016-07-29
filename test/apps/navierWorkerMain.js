// Import the lib/ mmodules via relative paths
import ColorMap from 'lib/ColorMap.js'
import Model from 'lib/Model.js'
import util from 'lib/util.js'
import DataSet from 'lib/DataSet.js'


class NavierModel extends Model {
  setup () {
    // console.log(' main setup called')
    util.error = console.warn
    this.anim.setRate(24)
    this.cmap = ColorMap.Jet
    worker.postMessage({type: 'setup', width: this.world.numX, height: this.world.numY})
  }

  step () {
    worker.postMessage({type: 'step'})
    worker.postMessage({type: 'getData'})
    if (model.anim.ticks > 600) this.stop()
  }

  // do this is order to draw them.
  putTypedArrayOnPatches (dens, boundaries) {
    for (let p of this.patches) {
      p.dens = dens[p.id]
      if (boundaries[p.id] > 0.0) {
        p.dens = 4.0
      }
    }
  }

  drawStep () {
    for (const p of this.patches) {
      p.setColor(this.cmap.scaleColor(p.dens || 0, 0, 1))
    }
    if (this.anim.ticks % 30 === 0) {
      console.log(this.anim.toString())
    }
  }
}

class thisIsAfuckedUpWayToStartAModelcausedByTranspiler {
  constructor () {
    const opts = {patchSize: 4, minX: -64, maxX: 64, minY: -64, maxY: 64}
    window.model = new NavierModel('layers', opts)
    model.start()
    // debugging
    const world = model.world
    const patches = model.patches
    util.toWindow({ model, world, patches, p: patches.oneOf() })
    util.addToDom(patches.pixels.ctx.canvas)
  }
}


var worker = new Worker('test/apps/navier-worker.js')

worker.onmessage = (ev) => {
  // console.log('main recieved msg', ev)
  var msg = ev.data
  if (typeof msg === 'object') {
    if (msg.type === 'data') { // array buffer
      var densView = new Float32Array(msg.dens)
      var boundaryView = new Float32Array(msg.boundaries)
      window.model.putTypedArrayOnPatches(densView, boundaryView)
      model.drawStep()
    } else if (msg.type) {
      if (msg.type === 'ready') {
        new thisIsAfuckedUpWayToStartAModelcausedByTranspiler()
      }
    }
  }
}
