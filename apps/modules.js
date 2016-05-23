// Import the lib/ mmodules via relative paths
import OofA from './OofA.js'
import DataSet from './DataSet.js'
import AgentSet from './AgentSet.js'
import Color from './Color.js'
import ColorMap from './ColorMap.js'
import util from './util.js'

const modules = { DataSet, util, OofA, AgentSet, Color, ColorMap }
util.copyTo(window, modules)
const { DataSet: ds, util: u, OofA: oofa, AgentSet: aset, Color: color, ColorMap: cmap } = modules
util.copyTo(window, { ds, u, oofa, aset, color, cmap })

console.log('DataSet, util, OofA, AgentSet, Color, ColorMap')
console.log('ds, u, oofa, aset, color, cmap')

// const as = AgentSet.AsSet([]) // []
// const as0 = Object.create(AgentSet) // []
//
// const size = 1e1
// util.repeat(size, (i) => as0.push({id: i}))
// util.repeat(size, (i) => as.push({id: i + 10}))
// const as1 = as.clone()
// const a = as.slice()
//
// // Object.setPrototypeOf(bigArray, AgentSet)
//
// util.copyTo(window, { as, as0, as1, a })

const size = 1e6 // ran in console, apparently better pro
const uint8 = new Uint8ClampedArray(size * 4) // 112M
const array8s = [] // 122M 10M overhead 10B per subarr
util.step(uint8.length, 4, (i) => array8s.push(uint8.subarray(i, i + 4)))

util.copyTo(window, { uint8, array8s })
console.log(uint8, array8s)

// console.log(DataSet, util, OofA, AgentSet, Color, ColorMap)
// console.log(ds, u, oofa, aset, color, cmap)
