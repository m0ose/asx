System.register(['lib/AgentSet.js', 'lib/Animator.js', 'lib/Color.js', 'lib/ColorMap.js', 'lib/DataSet.js', 'lib/Model.js', 'lib/OofA.js', 'lib/Patch.js', 'lib/Patches.js', 'lib/util.js'], function (_export, _context) {
  "use strict";

  var AgentSet, Animator, Color, ColorMap, DataSet, Model, OofA, Patch, Patches, util;
  return {
    setters: [function (_libAgentSetJs) {
      AgentSet = _libAgentSetJs.default;
    }, function (_libAnimatorJs) {
      Animator = _libAnimatorJs.default;
    }, function (_libColorJs) {
      Color = _libColorJs.default;
    }, function (_libColorMapJs) {
      ColorMap = _libColorMapJs.default;
    }, function (_libDataSetJs) {
      DataSet = _libDataSetJs.default;
    }, function (_libModelJs) {
      Model = _libModelJs.default;
    }, function (_libOofAJs) {
      OofA = _libOofAJs.default;
    }, function (_libPatchJs) {
      Patch = _libPatchJs.default;
    }, function (_libPatchesJs) {
      Patches = _libPatchesJs.default;
    }, function (_libUtilJs) {
      util = _libUtilJs.default;
    }],
    execute: function () {
      // Import the lib/ mmodules via relative paths


      const modules = {
        AgentSet, Animator, Color, ColorMap, DataSet,
        Model, OofA, Patch, Patches, util,
        pps: util.pps
      };
      util.toWindow(modules);
    }
  };
});