'use strict';

System.register(['lib/util.js', 'lib/Model.js', 'lib/Mouse.js'], function (_export, _context) {
  var util, Model, Mouse;
  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_libModelJs) {
      Model = _libModelJs.default;
    }, function (_libMouseJs) {
      Mouse = _libMouseJs.default;
    }],
    execute: function () {

      const modules = { Mouse, Model, util }; // Import the lib/ mmodules via relative paths

      util.toWindow(modules);
      console.log('modules:', Object.keys(modules).join(', '));

      class MouseTest extends Model {
        setup() {
          this.mouse = new Mouse(this, true, evt => {
            console.log(this.mouse);
          });
          this.mouse.start();
        }
      }
      const model = new MouseTest('layers'); // don't start, mouse driven instead
      util.toWindow({ model, mouse: model.mouse });
    }
  };
});