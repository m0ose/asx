#!/usr/bin/env node
const fs = require('fs')
const { spawn } = require('child_process')

const json = JSON.parse(fs.readFileSync('package.json'))

const libs = json.wraplibs

libs.forEach((lib) => {
  const [dir, name, style] = lib
  const toFile = dir.endsWith('.min.js')
    ? dir.replace(/\.min\.js/, '.wrapper.js')
    : dir.replace(/\.js/, '.wrapper.js')
  console.log('wraplibs:', dir, name, style, toFile)
  const wrapStream = fs.createWriteStream(toFile)
  const wrapProc = spawn('bin/wraplib.js', [dir, name, style])
  wrapProc.stdout.pipe(wrapStream)
})

// dirs=`bin/pkgkey.js 'wraplibs'`
//
// echo "wraplibs.sh"
// # echo 'libes to wrap' $dirs
//
// for dir in $dirs; do
//   toFile=`echo $dir | sed 's:\.min\.js:.wrapper.js:'`
//   echo $dir '->' $toFile
//   bin/wraplib.js $dir > $toFile
// done
