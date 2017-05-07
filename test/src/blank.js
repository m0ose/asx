import util from '../../dist/AS/util.js'
import AgentSet from '../../dist/AS/AgentSet.js'
import Animator from '../../dist/AS/Animator.js'
import Color from '../../dist/AS/Color.js'
import ColorMap from '../../dist/AS/ColorMap.js'
import DataSet from '../../dist/AS/DataSet.js'
import DataSetIO from '../../dist/AS/DataSetIO.js'
import Model from '../../dist/AS/Model.js'
import Mouse from '../../dist/AS/Mouse.js'
import OofA from '../../dist/AS/OofA.js'
import Patch from '../../dist/AS/Patch.js'
import Patches from '../../dist/AS/Patches.js'
import RGBDataSet from '../../dist/AS/RGBDataSet.js'
console.log('this', this)
const modules = {
  AgentSet, Animator, Color, ColorMap, DataSet, DataSetIO, Mouse, Model, OofA, Patch, Patches, RGBDataSet, util
}
util.toWindow(modules)

// works, but only as modules. scripts yields as = AS.as, sigh.
// import as from '../../dist/AS/AS.js'
// console.log(as)
// modules.util.toWindow(as)
