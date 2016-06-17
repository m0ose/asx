// Import the lib/ mmodules via relative paths
import OofA from 'lib/OofA.js'
import DataSet from 'lib/DataSet.js'
import AgentSet from 'lib/AgentSet.js'
import Color from 'lib/Color.js'
import ColorMap from 'lib/ColorMap.js'
import util from 'lib/util.js'

const modules =
  { DataSet, util, OofA, AgentSet, Color, ColorMap, pps: util.pps }
util.toWindow(modules)
