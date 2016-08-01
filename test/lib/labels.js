'use strict';

System.register(['lib/ColorMap.js', 'lib/Color.js', 'lib/Model.js', 'lib/util.js'], function (_export, _context) {
  var ColorMap, Color, Model, util;
  return {
    setters: [function (_libColorMapJs) {
      ColorMap = _libColorMapJs.default;
    }, function (_libColorJs) {
      Color = _libColorJs.default;
    }, function (_libModelJs) {
      Model = _libModelJs.default;
    }, function (_libUtilJs) {
      util = _libUtilJs.default;
    }],
    execute: function () {
      // Import the lib/ mmodules via relative paths

      window.pps = util.pps;

      const modules = { Color, ColorMap, Model, util, pps: util.pps };
      util.toWindow(modules);
      console.log(Object.keys(modules).join(' '));

      class LabelModel extends Model {
        setup() {
          this.cmap = ColorMap.grayColorMap(75, 150);
          this.trackColor = Color.toTypedColor('yellow');
          this.labeledPatches = this.patches.nOf(20);

          this.patches.setDefault('labelColor', Color.typedColor(256, 0, 0));
          this.setFont('patches', 'italic bold 20px sans-serif');

          this.anim.setRate(60);

          for (const p of this.patches) p.setColor(this.cmap.randomColor());

          this.stampLabels();
        }
        step() {
          this.eraseLabels();
          this.labeledPatches.forEach((p, i, a) => {
            a[i] = p.neighbors.oneOf();
          });
          this.stampLabels();
          if (this.anim.ticks % 100 === 0) console.log(this.anim.toString());
        }
        eraseLabels() {
          for (const p of this.labeledPatches) p.setLabel(null);
        }
        stampLabels() {
          for (const p of this.labeledPatches) {
            p.setLabel(p.id); // p.setLabel(`${p.id}`)
            p.setColor(this.trackColor);
          }
        }
      }
      // const [div, size, max, min] = ['layers', 4, 50, -50]
      const [div, size, min, max] = ['layers', 5, 0, 99];
      const opts = { patchSize: size, minX: 2 * min, maxX: 2 * max, minY: min, maxY: max };
      const model = new LabelModel(div, opts).start();
      const world = model.world;
      const patches = model.patches;
      util.toWindow({ model, world, patches, p: patches.oneOf() });
      // model.start()
      // if (size !== 1) util.addToDom(patches.pixels.ctx.canvas)
    }
  };
});