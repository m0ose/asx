# Links.js

Class Links is an AgentSet who's Agents connect (via class Link) two turtles. The purpose is to create graph semantics with turtle nodes and link edges.

## Statics

None.

## Constructor

None. Identical to AgentSet's [constructor](AgentSet?id=constructor).

The model.links are created by class Model: `new Links(model, Link, 'links')`

## Methods

> `create (from, to, initFcn = (link) => {})`

Add 1 or more links from the from turtle to the to turtle(s) which can be a single turtle or an array of turtles. The initFcn is called on each new link after it has been inserted into the links agentSet. Ex: paste this into the HelloWorld model's console:

```
let {turtles, links} = model
turtles.ask(t => {
  links.create(t, turtles.otherOneOf(t), (l) => {
    l.color = t.sprite.color
  })
})
```

If called with a turtle breed, will create instances of that breed.

## Properties

None. Inherit AgentSet properties.

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Links.js).
