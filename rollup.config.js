export default {
  entry: 'src/AS.js',
  moduleName: 'AS',
  targets: [
    { dest: 'dist/AS.js', format: 'iife' },
    { dest: 'dist/AS.modules.js', format: 'es' }
  ]
}
