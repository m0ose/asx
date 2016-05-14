/* eslint no-console: 0 */

// Import the lib/ mmodules via relative paths
import OofA from './OofA.js'
import DataSet from './DataSet.js'
import AgentSet from './AgentSet.js'
import Color from './Color.js'
import ColorMap from './ColorMap.js'
import util from './util.js'

util.copyTo(window, { DataSet, util, OofA, AgentSet, Color, ColorMap })
util.copyTo(window,
  { ds: DataSet, u: util, oa: OofA, aset: AgentSet, c: Color, cmap: ColorMap })

console.log('DataSet, util, OofA, AgentSet, Color, ColorMap')
console.log('ds, u, oa, aset, c, cmap')

const as = AgentSet.AsSet([]) // []
const as0 = Object.create(AgentSet) // []

const size = 1e1
util.repeat(size, (i) => as0.push({id: i}))
util.repeat(size, (i) => as.push({id: i + 10}))
const as1 = as.clone()
const a = as.slice()

// Object.setPrototypeOf(bigArray, AgentSet)

util.copyTo(window, { as, as0, as1, a })
