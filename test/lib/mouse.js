'use strict';

System.register(['lib/util.js', 'lib/Model.js', 'lib/Mouse.js', 'lib/ColorMap.js'], function (_export, _context) {
  var util, Model, Mouse, ColorMap;
  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_libModelJs) {
      Model = _libModelJs.default;
    }, function (_libMouseJs) {
      Mouse = _libMouseJs.default;
    }, function (_libColorMapJs) {
      ColorMap = _libColorMapJs.default;
    }],
    execute: function () {
      // Import the lib/ mmodules via relative paths


      const modules = { Mouse, Model, util };
      util.toWindow(modules);
      console.log('modules:', Object.keys(modules).join(', '));

      class MouseTest extends Model {
        setup() {
          for (const p of this.patches) {
            p.mycolor = 0;
          }
          this.cmap = ColorMap.Jet;
          // initialize the mouse
          this.mouse = new Mouse(this, true, evt => {
            let [x, y] = [Math.round(evt.x), Math.round(evt.y)]; // this causes problems if it is a float.
            let p = model.patches.patchXY(x, y);
            p.mycolor = Math.random();
            this.once(); // draw patches
          });
          this.mouse.start();
        }

        step() {
          for (const p of this.patches) {
            p.setColor(this.cmap.scaleColor(p.mycolor, 0, 1));
          }
        }
      }
      const model = new MouseTest('layers', {
        patchSize: 2,
        minX: -100,
        maxX: 114,
        minY: -117,
        maxY: 127
      }); // don't start, mouse driven instead
      model.once();
      util.toWindow({ model, mouse: model.mouse });
    }
  };
});