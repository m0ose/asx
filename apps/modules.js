/* eslint no-console: 0 */

// Import the lib/ mmodules via relative paths
import OofA from '../lib/OofA.js'
import DataSet from '../lib/DataSet.js'
import util from '../lib/util.js'

util.copyTo(window, { DataSet, util, OofA })

console.log('DataSet, util, OofA')

const bigArray = []
util.repeat(1e6, (i) => bigArray.push({id: i}))
