#!/usr/bin/env node

const fs = require('fs')

const args = process.argv
const file = args[2]
// default name for path/foo.min.js is foo
const name = args[3] || file.replace(/.*\//, '').replace(/\..*/, '')
const errMsg = `wrapper failed, file: ${file} name: ${name}`
const inWinMsg = // eslint-disable-line
  `wrapper: window.${name} exists; exporting it.`

const debug = true
const debugCode = debug
  ? `console.log('wraplib ${file} ${name}', {${name}, returnVal})`
  : ''

const code = fs.readFileSync(file)

const wrapper = `// Programmatically created by wraplib.js
let returnVal
let result

if (window.${name}) {
  console.log("${inWinMsg}")
  result = window.${name}
} else {

  function wrap () {

    returnVal =
    ${code}

    if (typeof returnVal === "boolean") returnVal = undefined
  }
  wrap.call(window)
  ${debugCode}
  result = window.${name} || returnVal
  if (!result) throw Error("${errMsg}")
}

export default result
`

process.stdout.write(wrapper)
