'use strict';

System.register(['./OofA.js', './DataSet.js', './util.js', 'node_modules/lzma/src/lzma_worker.js', 'node_modules/pako/dist/pako.js'], function (_export, _context) {
  var OofA, DataSet, util, LZMA, pako, ds, ctx, id, du, ctx1, du1, ds22, ds33, dseast, dssouth, ds10f, ds10i, useLZMA, popts, lmode, tiler, tilei, tc, td, percent, tdi, tdif, tdifs, tdu, t64, t64c;
  return {
    setters: [function (_OofAJs) {
      OofA = _OofAJs.default;
    }, function (_DataSetJs) {
      DataSet = _DataSetJs.default;
    }, function (_utilJs) {
      util = _utilJs.default;
    }, function (_node_modulesLzmaSrcLzma_workerJs) {
      LZMA = _node_modulesLzmaSrcLzma_workerJs.default;
    }, function (_node_modulesPakoDistPakoJs) {
      pako = _node_modulesPakoDistPakoJs.default;
    }],
    execute: function () {

      util.copyTo(window, { DataSet: DataSet, util: util, OofA: OofA, LZMA: LZMA, pako: pako });

      // Tests for lib/ modules. Replace eventually with testing libraries.

      // Import the lib/ mmodules

      ds = new DataSet(2, 3, new Uint8Array([0, 1, 2, 3, 4, 5]));

      console.log('ds', ds, 'data', ds.data);

      ctx = ds.toContext();
      id = util.ctxToImageData(ctx);

      console.log('to context image data', id.data);

      du = util.ctxToDataUrl(ctx);
      ctx1 = util.createCtx(ctx.canvas.width, ctx.canvas.height);

      ctx1.drawImage(ctx.canvas, 0, 0);
      du1 = util.ctxToDataUrl(ctx1);

      console.log('du === du1', du === du1);

      ds22 = new DataSet(2, 2, [20, 21, 22, 23]);

      console.log('ds22', ds22.data);
      ds33 = new DataSet(3, 3, [30, 31, 32, 33, 34, 35, 36, 37, 38]);

      console.log('ds33', ds33.data);
      dseast = ds.concatEast(ds33);
      dssouth = ds.concatSouth(ds22);

      console.log('ds.concatEast(ds33)', dseast);
      console.log('ds.concatSouth(ds22)', dssouth);

      ds10f = ds.resample(10, 10, false, Float32Array);

      console.log('resample ds 10x10 (floats trimmed)', util.fixedArray(ds10f.data));
      ds10i = new Uint8Array(ds10f.data.buffer);


      util.copyTo(window, { ds: ds, du: du, ctx: ctx, ds22: ds22, ds33: ds33, dseast: dseast, dssouth: dssouth, ds10f: ds10f, ds10i: ds10i });

      // const deflate = new pako.Deflate({ level: 3 })
      // deflate.push(ds10i, true)
      // const ds10d = deflate.result
      // const inflate = new pako.Inflate({ level: 3 })
      // inflate.push(ds10d, true)
      // const ds10di = inflate.result
      //
      // util.copyTo(window, { ds10d, ds10di })

      // const tiler = ds.resample(256, 256, false, Float32Array)
      // https://github.com/nmrugg/LZMA-JS
      // https://github.com/nodeca/pako
      useLZMA = false;
      popts = { level: 9 };
      lmode = 9;
      tiler = util.randomArray(256 * 256, 0, 1000, Float32Array);

      tiler = util.fixedArray(tiler, 2);
      tiler = new DataSet(256, 256, tiler);
      console.log('random 256x256 dataset', util.fixedArray(tiler.data));
      tilei = new Uint8Array(tiler.data.buffer);

      console.log('.. as Uint8Array', tilei);
      tc = useLZMA ? LZMA.compress(tilei, lmode) : pako.deflate(tilei, popts);
      td = useLZMA ? LZMA.decompress(tc) : pako.inflate(tc);
      percent = 100 * util.fixed(tc.length / td.length);

      console.log(useLZMA ? 'LZMA' : 'Pako', 'compression', td.length, '->', tc.length, percent, '%');

      util.copyTo(window, { tiler: tiler, tilei: tilei, tc: tc, td: td });

      console.log('decompressed ints === int view onto dataset?', util.aPairEq(tilei, td));
      tdi = new Uint8Array(td);
      tdif = new tiler.data.constructor(tdi.buffer);

      console.log('decompressed floats === dataset.data?', util.aPairEq(tiler.data, tdif));
      tdifs = util.clone(tdif).sort(function (a, b) {
        return a - b;
      });
      tdu = util.uniq(tdifs);

      console.log('sorted floats', util.fixedArray(tdifs, 6));
      console.log('unique?', tdu.length === tdif.length, util.fixedArray(tdu));
      console.log('    ', tdif.length, '->', tdu.length);

      util.copyTo(window, { tdi: tdi, tdif: tdif, tdifs: tdifs, tdu: tdu });

      t64 = tiler.toDataUrl();

      console.log('t64 length', t64.length);
      t64c = useLZMA ? LZMA.compress(tilei, lmode) : pako.deflate(tilei, popts);


      util.copyTo(window, { t64: t64, t64c: t64c });
    }
  };
});