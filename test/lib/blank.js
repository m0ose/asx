System.register(['lib/OofA.js', 'lib/DataSet.js', 'lib/AgentSet.js', 'lib/Color.js', 'lib/ColorMap.js', 'lib/util.js'], function (_export, _context) {
  "use strict";

  var OofA, DataSet, AgentSet, Color, ColorMap, util;
  return {
    setters: [function (_libOofAJs) {
      OofA = _libOofAJs.default;
    }, function (_libDataSetJs) {
      DataSet = _libDataSetJs.default;
    }, function (_libAgentSetJs) {
      AgentSet = _libAgentSetJs.default;
    }, function (_libColorJs) {
      Color = _libColorJs.default;
    }, function (_libColorMapJs) {
      ColorMap = _libColorMapJs.default;
    }, function (_libUtilJs) {
      util = _libUtilJs.default;
    }],
    execute: function () {
      // Import the lib/ mmodules via relative paths


      const modules = { DataSet, util, OofA, AgentSet, Color, ColorMap, pps: util.pps };
      util.toWindow(modules);
    }
  };
});