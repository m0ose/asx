'use strict';

System.register(['./OofA.js', './DataSet.js', './AgentSet.js', './Color.js', './ColorMap.js', './util.js'], function (_export, _context) {
  var OofA, DataSet, AgentSet, Color, ColorMap, util, modules, oa, runs, test, test1, gs, obj, id, color, position, obj1, id1, color1, position1;
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

      console.log('DataSet, util, OofA, AgentSet, Color, ColorMap');
      console.log('ds, u, oofa, aset, color, cmap');

      oa = new OofA({
        id: Uint32Array,
        color: Uint8Array,
        colorMap: [[1, 2, 3], 0],
        position: [Float32Array, 2] // x, y
      }, 2, 2);


      util.repeat(4, function (i) {
        oa.push({
          id: i,
          color: i * 10,
          position: [i, i + 2]
        });
      });

      runs = 1e6;
      test = new OofA({
        id: Uint32Array,
        color: Uint8Array,
        colorMap: [[1, 2, 3], 0],
        position: [Float32Array, 2] // x, y
      }, runs, 0);

      util.timeit(function (i) {
        test.push({
          id: i,
          color: i % 25,
          position: [i, i]
        });
      }, runs, 'getterSetter push');

      test1 = new OofA({
        id: Uint32Array,
        color: Uint8Array,
        colorMap: [[1, 2, 3], 0],
        position: [Float32Array, 2] // x, y
      }, runs, 0);

      util.timeit(function (i) {
        test1.pushObject({
          id: i,
          color: i % 25,
          position: [i, i]
        });
      }, runs, 'object push');

      gs = test.createGetterSetter();
      obj = void 0;
      id = void 0;
      color = void 0;
      position = void 0;
      obj1 = void 0;
      id1 = void 0;
      color1 = void 0;
      position1 = void 0;

      util.timeit(function (i) {
        obj = gs;
        obj.ix = i;
        id = obj.id;
        color = obj.color;
        position = obj.position;
      }, runs, 'getterSetter getObject');
      util.timeit(function (i) {
        obj1 = test1.getObject(i, obj1);
        id1 = obj1.id;
        color1 = obj1.color;
        position1 = obj1.position;
      }, runs, 'object getObject');

      util.copyTo(window, { oa: oa, runs: runs, test: test, test1: test1, gs: gs, obj: obj, obj1: obj1 });
      util.copyTo(window, { id: id, color: color, position: position, id1: id1, color1: color1, position1: position1 });
    }
  };
});