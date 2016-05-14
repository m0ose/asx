'use strict';

System.register(['./OofA.js', './DataSet.js', './AgentSet.js', './Color.js', './ColorMap.js', './util.js'], function (_export, _context) {
  var OofA, DataSet, AgentSet, Color, ColorMap, util, as, as0, size, as1, a;
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


      util.copyTo(window, { DataSet: DataSet, util: util, OofA: OofA, AgentSet: AgentSet, Color: Color, ColorMap: ColorMap });
      util.copyTo(window, { ds: DataSet, u: util, oa: OofA, aset: AgentSet, c: Color, cmap: ColorMap });

      console.log('DataSet, util, OofA, AgentSet, Color, ColorMap');
      console.log('ds, u, oa, aset, c, cmap');

      as = AgentSet.AsSet([]);
      as0 = Object.create(AgentSet);
      size = 1e1;

      util.repeat(size, function (i) {
        return as0.push({ id: i });
      });
      util.repeat(size, function (i) {
        return as.push({ id: i + 10 });
      });
      as1 = as.clone();
      a = as.slice();


      // Object.setPrototypeOf(bigArray, AgentSet)

      util.copyTo(window, { as: as, as0: as0, as1: as1, a: a });
    }
  };
});
//# sourceMappingURL=modules.js.map