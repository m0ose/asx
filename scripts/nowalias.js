const spawnSync = require('child_process').spawnSync

const ls = spawnSync('now', ['ls'])
const result = ls.output.toString()
const urls = result.match(/(https.\S*)/g)
const url = urls[0]
const alias = process.env.npm_package_nowalias || url.replace(/-[^.]*/, '')

spawnSync('now', ['alias', url, alias])
