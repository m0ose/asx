export default {
  entry: 'src/AS.js',
  targets: [
    { dest: 'dist/AS.js', format: 'iife', moduleName: 'AS' },
    { dest: 'dist/AS.modules.js', format: 'es' }
  ]
}
