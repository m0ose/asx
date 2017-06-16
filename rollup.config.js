// externals = (id) => id.includes('/libs/')
function externals (id) { return id.includes('/libs/') }

export default {
  entry: 'src/AS.js',
  banner: '/* eslint-disable */',
  external: externals,
  // external: [
  //   'stats.wrapper.js',
  //   'dat.gui.wrapper.js',
  //   'three.module.js',
  //   'OrbitControls.js'
  // ],
  // external: [
  //   'Stats',
  //   'dat',
  //   'THREE',
  //   'OrbitControls'
  // ],
  // paths: { // id: path
  //   Stats: 'http://backspaces.github.io/asx/libs/Stats.js'
  // },
  targets: [
    { dest: 'dist/AS.js',
      format: 'iife',
      globals: { // id: name pairs (import name from id)
        '../libs/stats.wrapper.js': 'Stats',
        '../libs/dat.gui.wrapper.js': 'dat',
        '../libs/three.wrapper.js': 'THREE',
        '../libs/OrbitControls.js': 'OrbitControls'
      },
      // external: [
      //   'http://backspaces.github.io/asx/libs/three.module.js'
      // ],
      // global: {
      //   THREE: 'http://backspaces.github.io/asx/libs/three.module.js'
      // },
      moduleName: 'AS'
    },
    { dest: 'dist/AS.module.js',
      // external: [
      //   'http://backspaces.github.io/asx/libs/three.module.js'
      // ],
      format: 'es'
    }
  ]
}
