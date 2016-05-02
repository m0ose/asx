'use strict';

System.register(['./OofA.js', './DataSet.js', './util.js'], function (_export, _context) {
  var OofA, DataSet, util, bigArray;
  return {
    setters: [function (_OofAJs) {
      OofA = _OofAJs.default;
    }, function (_DataSetJs) {
      DataSet = _DataSetJs.default;
    }, function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {

      util.copyTo(window, { DataSet: DataSet, util: util, OofA: OofA }); /* eslint no-console: 0 */

      // Import the lib/ mmodules via relative paths


      console.log('DataSet, util, OofA');

      bigArray = [];

      util.repeat(1e6, function (i) {
        return bigArray.push({ id: i });
      });
    }
  };
});
//# sourceMappingURL=modules.js.map