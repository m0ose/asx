// Import the lib/ mmodules via relative paths
import AgentSet from 'lib/AgentSet.js'
import Animator from 'lib/Animator.js'
import Color from 'lib/Color.js'
import ColorMap from 'lib/ColorMap.js'
import DataSet from 'lib/DataSet.js'
import Model from 'lib/Model.js'
import OofA from 'lib/OofA.js'
import Patch from 'lib/Patch.js'
import Patches from 'lib/Patches.js'
import util from 'lib/util.js'

const modules = {
  AgentSet, Animator, Color, ColorMap, DataSet,
  Model, OofA, Patch, Patches, util,
  pps: util.pps
}
util.toWindow(modules)
