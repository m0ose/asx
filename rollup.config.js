export default {
  entry: 'src/AS.js',
  targets: [
    { dest: 'dist/AS.js',
      format: 'iife',
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
