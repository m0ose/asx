// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import Model from 'lib/Model.js'
import Mouse from 'lib/Mouse.js'

const modules = { Mouse, Model, util }
util.toWindow(modules)
console.log('modules:', Object.keys(modules).join(', '))

class MouseTest extends Model {
  setup () {
    this.mouse = new Mouse(this, true, (evt) => { console.log(this.mouse) })
    this.mouse.start()
  }
}
const model = new MouseTest('layers') // don't start, mouse driven instead
util.toWindow({model, mouse: model.mouse})
