#!/usr/bin/env node

const fs = require('fs')
const args = process.argv
const file = args[2]
const code = fs.readFileSync(file)
let name = args[3]
if (!name) {
  name = file.replace(/.*\//, '')
  name = name.replace(/\..*/, '')
}
const errMsg = `wrapper failed, file: ${file} name: ${name}`
const debug = true
const debugCode = debug
  ? `console.log('wraplib ${file} ${name}', {self, window, module, returnVal})`
  : ''

const wrapper = `// Programmatically created by wraplib.js
const exports = {}
const module = {}
const window = {}
const self = {}
let returnVal

function wrap () {

returnVal =
${code}

}
wrap.call(self)
${debugCode}
const result = self.${name} || window.${name} || module.exports || returnVal
if (!result) throw Error("${errMsg}")
export default result
`

process.stdout.write(wrapper)
