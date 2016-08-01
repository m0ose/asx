'use strict';

System.register(['lib/util.js', 'lib/AgentSet.js', 'lib/Animator.js', 'lib/Color.js', 'lib/ColorMap.js', 'lib/DataSet.js', 'lib/Model.js', 'lib/Mouse.js', 'lib/OofA.js', 'lib/Patch.js', 'lib/Patches.js'], function (_export, _context) {
  var util, AgentSet, Animator, Color, ColorMap, DataSet, Model, Mouse, OofA, Patch, Patches;
  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_libAgentSetJs) {
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
    }, function (_libMouseJs) {
      Mouse = _libMouseJs.default;
    }, function (_libOofAJs) {
      OofA = _libOofAJs.default;
    }, function (_libPatchJs) {
      Patch = _libPatchJs.default;
    }, function (_libPatchesJs) {
      Patches = _libPatchesJs.default;
    }],
    execute: function () {

      const modules = {
        AgentSet, Animator, Color, ColorMap, DataSet,
        Mouse, Model, OofA, Patch, Patches, util
      }; // Import the lib/ mmodules via relative paths
      // Import the lib/ mmodules via relative paths

      util.toWindow(modules);
      console.log('modules:', Object.keys(modules).join(', '));
    }
  };
});