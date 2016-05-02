/* eslint no-console: 0 */

// Import the lib/ mmodules via relative paths
import OofA from './OofA.js'
import DataSet from './DataSet.js'
import util from './util.js'

util.copyTo(window, { DataSet, util, OofA })

console.log('DataSet, util, OofA')

const bigArray = []
util.repeat(1e6, (i) => bigArray.push({id: i}))
