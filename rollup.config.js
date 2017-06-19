// externals = (id) => id.includes('/libs/')
function externals (id) { return id.includes('/dist/') }

export default {
  entry: 'src/AS.js',
  banner: '/* eslint-disable */',
  external: externals,
  targets: [
    { dest: 'dist/AS.js',
      format: 'iife',
      globals: { // id: name pairs (import name from id)
        '/Users/owen/Dropbox/src/asx/dist/stats.wrapper.js': 'Stats',
        '/Users/owen/Dropbox/src/asx/dist/dat.gui.wrapper.js': 'dat',
        '/Users/owen/Dropbox/src/asx/dist/three.wrapper.js': 'THREE',
        // '/Users/owen/Dropbox/src/asx/dist/OrbitControls.wrapper.js': 'THREE.OrbitControls'
      },
      moduleName: 'AS'
    },
    { dest: 'dist/AS.module.js',
      format: 'es'
    }
  ]
}
