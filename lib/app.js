'use strict';

System.register(['lib/OofA.js', 'lib/DataSet.js', 'lib/util.js', 'node_modules/lzma/src/lzma_worker.js'], function (_export, _context) {
  var OofA, DataSet, util, LZMA;
  return {
    setters: [function (_libOofAJs) {
      OofA = _libOofAJs.default;
    }, function (_libDataSetJs) {
      DataSet = _libDataSetJs.default;
    }, function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_node_modulesLzmaSrcLzma_workerJs) {
      LZMA = _node_modulesLzmaSrcLzma_workerJs.default;
    }],
    execute: function () {

      // Tests for lib/ modules. Replace eventually with testing libraries.

      /* eslint no-console: 0 */

      // Import the lib/ mmodules

      const ds = new DataSet(2, 3, new Uint8Array([0, 1, 2, 3, 4, 5]));
      console.log('ds', ds, 'data', ds.data);

      const ctx = ds.toContext();
      const id = util.ctxToImageData(ctx);
      console.log('to context image data', id.data);

      const du = util.ctxToDataUrl(ctx);
      const ctx1 = util.createCtx(ctx.canvas.width, ctx.canvas.height);
      ctx1.drawImage(ctx.canvas, 0, 0);
      const du1 = util.ctxToDataUrl(ctx1);
      console.log('du === du1', du === du1);

      const ds22 = new DataSet(2, 2, [20, 21, 22, 23]);
      console.log('ds22', ds22.data);
      const ds33 = new DataSet(3, 3, [30, 31, 32, 33, 34, 35, 36, 37, 38]);
      console.log('ds33', ds33.data);
      const [dseast, dssouth] = [ds.concatEast(ds33), ds.concatSouth(ds22)];
      console.log('ds.concatEast(ds33)', dseast);
      console.log('ds.concatSouth(ds22)', dssouth);

      const ds10f = ds.resample(10, 10, false, Float32Array);
      console.log('resample ds', util.fixedArray(ds10f.data));

      const tile = ds.resample(256, 256, false, Float32Array);
      console.log('tile', tile);

      // Debug by adding to window global. Use these in console for testing.
      util.mergeObject(window, { DataSet, util, OofA, LZMA });
      util.mergeObject(window, { ds, du, ctx, ds22, ds33, dseast, dssouth, ds10f, tile });
    }
  };
});