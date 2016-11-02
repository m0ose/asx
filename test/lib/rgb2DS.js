System.register(['lib/RGBDataSet.js', 'lib/util.js', 'lib/ColorMap.js', 'lib/Model.js'], function (_export, _context) {
  "use strict";

  var RGBDataSet, util, ColorMap, Model;
  return {
    setters: [function (_libRGBDataSetJs) {
      RGBDataSet = _libRGBDataSetJs.default;
    }, function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_libColorMapJs) {
      ColorMap = _libColorMapJs.default;
    }, function (_libModelJs) {
      Model = _libModelJs.default;
    }],
    execute: function () {

      function main() {
        testRGB();
      }

      function testRGB() {
        const imgurl = 'test/data/7.15.35.png';
        util.imagePromise(imgurl).then(img => {
          console.log(img);
          var ds = new RGBDataSet(img);
          // put colors onto a model
          model.patches.importDataSet(ds, 'elev', true);
          const cmap = ColorMap.Jet;
          const [min, max] = [ds.min(), ds.max()];
          console.log('min:', min, 'max:', max);
          for (const p of model.patches) {
            p.setColor(cmap.scaleColor(p.elev, min, max));
          }
          model.once();
          console.log(ds);
        });
      }

      const model = new Model('layers', {
        patchSize: 1,
        minX: -100,
        maxX: 355,
        minY: 0,
        maxY: 255
      });

      util.toWindow({ model });

      main();
    }
  };
});