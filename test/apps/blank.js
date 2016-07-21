// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import AgentSet from 'lib/AgentSet.js'
import Animator from 'lib/Animator.js'
import Color from 'lib/Color.js'
import ColorMap from 'lib/ColorMap.js'
import DataSet from 'lib/DataSet.js'
import Model from 'lib/Model.js'
import Mouse from 'lib/Mouse.js'
import OofA from 'lib/OofA.js'
import Patch from 'lib/Patch.js'
import Patches from 'lib/Patches.js'

const modules = {
  AgentSet, Animator, Color, ColorMap, DataSet,
  Mouse, Model, OofA, Patch, Patches, util,
  pps: util.pps
}
util.toWindow(modules)
console.log('modules:', Object.keys(modules).toString())

// const el = document.getElementById('layers')
// util.toWindow({el})
// el.style.width = 400
// el.style.height = 400
// const mouse = new Mouse(el, (evt) => { console.log(mouse) })

const model = new Model('layers')
const mouse = new Mouse(model, true, (evt) => { console.log(mouse) }).start()
// mouse.start()
util.toWindow({model, mouse})
