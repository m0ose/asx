'use strict';

System.register(['./OofA.js', './DataSet.js', './AgentSet.js', './Color.js', './ColorMap.js', './util.js'], function (_export, _context) {
  var OofA, DataSet, AgentSet, Color, ColorMap, util, modules, ds, u, oofa, aset, color, cmap, size, uint8, array8s;
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
      modules = { DataSet: DataSet, util: util, OofA: OofA, AgentSet: AgentSet, Color: Color, ColorMap: ColorMap };

      util.copyTo(window, modules);
      ds = modules.DataSet;
      u = modules.util;
      oofa = modules.OofA;
      aset = modules.AgentSet;
      color = modules.Color;
      cmap = modules.ColorMap;

      util.copyTo(window, { ds: ds, u: u, oofa: oofa, aset: aset, color: color, cmap: cmap });

      console.log('DataSet, util, OofA, AgentSet, Color, ColorMap');
      console.log('ds, u, oofa, aset, color, cmap');

      // const as = AgentSet.AsSet([]) // []
      // const as0 = Object.create(AgentSet) // []
      //
      // const size = 1e1
      // util.repeat(size, (i) => as0.push({id: i}))
      // util.repeat(size, (i) => as.push({id: i + 10}))
      // const as1 = as.clone()
      // const a = as.slice()
      //
      // // Object.setPrototypeOf(bigArray, AgentSet)
      //
      // util.copyTo(window, { as, as0, as1, a })

      size = 1e6;
      uint8 = new Uint8ClampedArray(size * 4);
      array8s = [];
      // 122M 10M overhead 10B per subarr
      util.step(uint8.length, 4, function (i) {
        return array8s.push(uint8.subarray(i, i + 4));
      });

      util.copyTo(window, { uint8: uint8, array8s: array8s });
      console.log(uint8, array8s);

      // console.log(DataSet, util, OofA, AgentSet, Color, ColorMap)
      // console.log(ds, u, oofa, aset, color, cmap)
    }
  };
});