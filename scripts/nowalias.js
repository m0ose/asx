const spawnSync = require('child_process').spawnSync

const ls = spawnSync('now', ['ls'])
const result = ls.output.toString()
const urls = result.match(/(https.\S*)/g)
const url = urls[0]
console.log(`url: ${url}`)
console.log(`process.env.npm_package_nowalias: ${process.env.npm_package_nowalias}`)
const alias = process.env.npm_package_nowalias || url.replace(/-[^.]*/, '')
console.log(`alias: ${alias}`)
spawnSync('now', ['alias', url, alias])
