## AgentScript Modules Repository

This is a repository for the future version of [AgentScript](http://agentscript.org), an es6 module based project.

### Documentation

Developer Documentation is created by [docco](https://jashkenas.github.io/docco/) and is [available here](http://backspaces.github.io/asx/docs/Model.html) Use **Jump To** menu, top right, to navigate between modules.

### Developer Information

To clone a fresh repo, for PRs or your own local verson:
* cd to where you want the asx/ dir to appear.
* git clone https://github.com/backspaces/asx # create skeleton repo
* cd asx # go to new repo
* npm install # install all dev dependencies & runs `npm run build`
* open `http://<path to asx>/test.html` and check console for messages

All workflow is npm run scripts.  See package.json's scripts, or simply run `npm run` for a list.

The repo has no "derived" files, i.e. won't run by just cloning. To complete the repo, use `npm install` which refreshes npm dependencies and does a clean build of the repo.

### Github Pages

A [gh-pages branch](http://backspaces.github.io/asx/) is used for the site. It contains the complete master repo, including the derived files. A new page is made from master by:
* npm run gh-pages

This can be used to run tests and access modules:
* [http://backspaces.github.io/asx/test.html?diffuse](http://backspaces.github.io/asx/test.html?diffuse)
* [http://backspaces.github.io/asx/docs/Model.html](http://backspaces.github.io/asx/docs/Model.html)

It can also be used as a CDN for all the modules:
* import Model from '[http://backspaces.github.io/asx/lib/Model.js](http://backspaces.github.io/asx/lib/Model.js)'

### Three.js

ASX has been converted from layers of 2D canvases to a single WebGL canvas, currently managed by [Three.js](https://threejs.org/). This is a breaking change, primarily changing subclassing of class Model.

The 'div' used by Model's ctor should generally be `document.body`. In addition, there is a Three parameters object in the ctor, defaulting to that used by the test.html suite.

The conversion of the [fire](http://backspaces.github.io/asx/test.html?fire) model is an example of the minor changes needed in converting to Three.js.
