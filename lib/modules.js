'use strict';

System.register(['../lib/OofA.js', '../lib/DataSet.js', '../lib/util.js'], function (_export, _context) {
  var OofA, DataSet, util;
  return {
    setters: [function (_libOofAJs) {
      OofA = _libOofAJs.default;
    }, function (_libDataSetJs) {
      DataSet = _libDataSetJs.default;
    }, function (_libUtilJs) {
      util = _libUtilJs.default;
    }],
    execute: function () {

      util.copyTo(window, { DataSet, util, OofA }); /* eslint no-console: 0 */

      // Import the lib/ mmodules via relative paths


      console.log('DataSet, util, OofA');

      const bigArray = [];
      util.repeat(1e6, i => bigArray.push({ id: i }));
    }
  };
});