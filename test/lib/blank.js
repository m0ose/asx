System.register(['lib/util.js', 'lib/AgentSet.js', 'lib/Animator.js', 'lib/Color.js', 'lib/ColorMap.js', 'lib/DataSet.js', 'lib/DataSetIO.js', 'lib/Model.js', 'lib/Mouse.js', 'lib/OofA.js', 'lib/Patch.js', 'lib/Patches.js', 'lib/RGBDataSet.js'], function (_export, _context) {
  "use strict";

  var util, AgentSet, Animator, Color, ColorMap, DataSet, DataSetIO, Model, Mouse, OofA, Patch, Patches, RGBDataSet;
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
    }, function (_libDataSetIOJs) {
      DataSetIO = _libDataSetIOJs.default;
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
    }, function (_libRGBDataSetJs) {
      RGBDataSet = _libRGBDataSetJs.default;
    }],
    execute: function () {

      const modules = {
        AgentSet, Animator, Color, ColorMap, DataSet, DataSetIO,
        Mouse, Model, OofA, Patch, Patches, RGBDataSet, util
      }; // Import the lib/ mmodules via relative paths

      util.toWindow(modules);
      console.log('modules:', Object.keys(modules).join(', '));
    }
  };
});