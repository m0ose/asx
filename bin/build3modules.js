#!/usr/bin/env node

// Convert three "examples" to es6 modules.
// The files to convert are in package.json.threelibs
const fs = require('fs')

const fromPath = 'node_modules/three/examples/js/'
const toPath = 'libs/'
// const THREEPath = 'libs/three.min.js'
const THREEPath = 'libs/three.module.js'

// Each name is a lib/name (w/o.js) pair in THREE's examples/js hierarchy
const threeLibNames = JSON.parse(fs.readFileSync('package.json')).threelibs

threeLibNames.forEach((dirNamePair) => {
  const [dir, name] = dirNamePair.split('/')
  let code = fs.readFileSync(`${fromPath}${dir}/${name}.js`).toString()
  code = code.replace(new RegExp(`THREE\\.${name}`, 'g'), `${name}`)
  code = code.replace(new RegExp(`${name} *= *`), `const ${name} = `)
  code =
`import * as THREE from '${THREEPath}'
${code}
export default ${name}
`
  fs.writeFileSync(`${toPath}${name}.module.js`, code)
})
