# AS.js

This module simply imports all the AgentScript modules, and exports them as a single object module, bundled by [Rollup](rollupjs.org). Two formats are made: IIFE and es6 Module. The Rollup is performed using a [rollup.config.js](https://github.com/backspaces/asx/blob/master/rollup.config.js) file.

## The imports/exports

Here how it's done:
```javascript
import AgentSet        from './AgentSet.js'
import Animator        from './Animator.js'
...
import util            from './util.js'

export {
  AgentSet,
  Animator,
  ...
  util
}
```

## Two Bundles

There are two Rollup bundles made from AS.js:
* dist/AS.js: an [IIFE bundle](http://backspaces.github.io/asx/dist/AS.js) for use with `<script>` tags.
* dist/AS.module.js: an [es6 bundle](http://backspaces.github.io/asx/dist/AS.module.js) containing all the AgentScript modules.

These can be used as a CDN for both `<script>` tags and `import` paths.

## Usage

Legacy usage requires these `<script>` tags in an html file:
```html
<script
  src="https://unpkg.com/three@0.85.2/examples/js/libs/dat.gui.min.js">
</script>
<script
  src="https://unpkg.com/three@0.85.2/examples/js/libs/stats.min.js">
</script>
<script
  src="https://unpkg.com/three@0.85.2/build/three.min.js">
</script>
<script
  src="https://unpkg.com/three@0.85.2/examples/js/controls/OrbitControls.js">
</script>

<script src="http://backspaces.github.io/asx/dist/AS.js"></script>
```
In addition, any libraries your model requires should be added.

Es6 modules uses no `<script>` tags. Instead, the `import` statement is used. The key difference is that with legacy usage, the html file specifies the dependency, while with es6 modules, the source itself does.

This is much less error prone. It is also faster due to use of async HTTP/2 loading.

## AS.js vs AS.module.js usage

Rolling up the legacy and es6 modules has a nice side effect, they are very similar in syntax:

Legacy: <br />
`const {ColorMap, DataSet, Model, util} = AS`

Modules: <br />
`import {ColorMap, DataSet, Model, util} from 'path/to/AS.module.js'`

This allows us to easily convert es6 module based sample models to script based models.
