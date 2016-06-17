System.register(['./AgentSet.js', './util.js'], function (_export, _context) {
  "use strict";

  var AgentSet, util;
  return {
    setters: [function (_AgentSetJs) {
      AgentSet = _AgentSetJs.default;
    }, function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {

      class Patches extends AgentSet {
        constructor(model, agentProto, name, baseSet = null) {
          console.log('Patches ctor', arguments);
          super(model, agentProto, name, baseSet);
        }
      }

      _export('default', Patches);
    }
  };
});