'use strict';

System.register(['./OofA.js', './DataSet.js', './AgentSet.js', './Color.js', './ColorMap.js', './util.js'], function (_export, _context) {
  var OofA, DataSet, AgentSet, Color, ColorMap, util;
  return {
    setters: [function (_OofAJs) {
      OofA = _OofAJs.default;
    }, function (_DataSetJs) {
      DataSet = _DataSetJs.default;
    }, function (_AgentSetJs) {
      AgentSet = _AgentSetJs.default;
    }, function (_ColorJs) {
      Color = _ColorJs.default;
    }, function (_ColorMapJs) {
      ColorMap = _ColorMapJs.default;
    }, function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {
      /* eslint no-console: 0 */

      // Import the lib/ mmodules via relative paths


      util.copyTo(window, { DataSet, util, OofA, AgentSet, Color, ColorMap });
      util.copyTo(window, { ds: DataSet, u: util, oa: OofA, aset: AgentSet, c: Color, cmap: ColorMap });

      console.log('DataSet, util, OofA, AgentSet, Color, ColorMap');
      console.log('ds, u, oa, aset, c, cmap');

      const as = AgentSet.AsSet([]); // []
      const as0 = Object.create(AgentSet); // []

      const size = 1e1;
      util.repeat(size, i => as0.push({ id: i }));
      util.repeat(size, i => as.push({ id: i + 10 }));
      const as1 = as.clone();
      const a = as.slice();

      // Object.setPrototypeOf(bigArray, AgentSet)

      util.copyTo(window, { as, as0, as1, a });
    }
  };
});