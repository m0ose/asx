'use strict';

System.register(['./Color.js', './ColorMap.js', './util.js'], function (_export, _context) {
  var Color, ColorMap, util, _util$Color$ColorMap, u, c, cmap, tc, tcstr, tcpix, tca, tcta, gid, gic, c0, rgbs, trgbs, basicmap, basicmap0, webglArray, graymap, rgbcube, rgbmap, hslmap, gradientmap, redorange, nlred, cssmap;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  return {
    setters: [function (_ColorJs) {
      Color = _ColorJs.default;
    }, function (_ColorMapJs) {
      ColorMap = _ColorMapJs.default;
    }, function (_utilJs) {
      util = _utilJs.default;
    }],
    execute: function () {

      util.copyTo(window, { util: util, Color: Color, ColorMap: ColorMap }); /* eslint no-console: 0 */

      // Import the lib/ mmodules via relative paths

      _util$Color$ColorMap = { util: util, Color: Color, ColorMap: ColorMap };
      u = _util$Color$ColorMap.util;
      c = _util$Color$ColorMap.Color;
      cmap = _util$Color$ColorMap.ColorMap;

      util.copyTo(window, { u: u, c: c, cmap: cmap });

      console.log('util, Color, ColorMap');
      console.log('u, c, cmap');

      tc = Color.typedColor(255, 0, 0);

      console.log('typedColor tc: color', tc.toString(), 'string', tc.getString(), 'pixel', tc.getPixel());

      tcstr = Color.toTypedColor('red');
      tcpix = Color.toTypedColor(4278190335);
      tca = Color.toTypedColor([255, 0, 0]);
      tcta = Color.toTypedColor(new Uint8Array([255, 0, 0, 255]));


      console.log('toTypedColor: tcstr, tcpix, tca, tcta', tcstr.toString(), tcpix.toString(), tca.toString(), tcta.toString());
      util.copyTo(window, { tc: tc, tcstr: tcstr, tcpix: tcpix, tca: tca, tcta: tcta });

      // util.step(10, 2, (i) => console.log(i))
      gid = cmap.gradientImageData(10, ['red', 'green']);

      console.log('gradientImageData', gid);

      gic = cmap.typedArrayToTypedColors(gid);

      console.log('gradientImageColors', util.arraysToString(gic));

      c0 = gic[0];

      console.log('color0', c0, c0.getPixel(), c0.getString());

      rgbs = cmap.permuteRGBColors(2, 2, 3);

      console.log('permuteRGBColors(2,2,3)', util.arraysToString(rgbs));
      console.log('permuteRGBColors length)', rgbs.length);

      trgbs = cmap.arraysToColors(rgbs);

      console.log('arraysToColors', util.arraysToString(trgbs));

      basicmap = cmap.basicColorMap(rgbs);

      console.log('basicmap', basicmap.toString());
      console.log('basicmap prototypes');util.pps(basicmap);
      basicmap0 = basicmap[0];

      console.log('basicmap[0] prototypes', basicmap0);util.pps(basicmap0);

      console.log('lookup basicmap[5]', basicmap.lookup(basicmap[5]));
      basicmap.createIndex();
      console.log('lookup basicmap[5] w/ index', basicmap.lookup(basicmap[5]));

      console.log('random color', basicmap.randomColor());

      console.log('scaleColor(i, 0, 5) for i in [0, 5]');
      util.repeat(6, function (i) {
        var c = basicmap.scaleColor(i, 0, 5);
        var ix = basicmap.lookup(c);
        console.log('c', c, 'i', i, 'ix', ix);
      });

      webglArray = basicmap.webglArray();

      console.log('webglArray', webglArray);

      graymap = cmap.grayColorMap(16);

      console.log('graymap(16)', graymap.toString());

      rgbcube = cmap.rgbColorCube(4, 4, 2);

      console.log('rgbcube(4,4,2)', rgbcube.toString());

      rgbmap = cmap.rgbColorMap([100, 200, 300], [255], [128, 255]);

      console.log('rgbmap([100,200,300],[255],[128,255])', rgbmap.toString());

      hslmap = cmap.hslColorMap(util.aIntRamp(0, 350, 25));

      console.log('hslColorMap(util.aIntRamp(0, 350, 100))', hslmap.toString());

      gradientmap = cmap.gradientColorMap(50, cmap.jetColors);

      console.log('cmap.jetColors:', util.arraysToString(cmap.jetColors));
      console.log('gradientColorMap(50, cmap.jetColors)', gradientmap.toString());

      redorange = cmap.gradientColorMap(11, ['red', 'blue']);

      console.log('red-blue gradient', redorange.toString());
      nlred = cmap.gradientColorMap(11, ['black', 'red', 'white']);

      console.log('NetLogo red ramp', nlred.toString());

      cssmap = cmap.cssColorMap(cmap.basicColorNames);

      console.log('cssmap(basicColorNames)', cssmap.toString());

      util.copyTo(window, { gid: gid, gic: gic, c0: c0, rgbs: rgbs, trgbs: trgbs, basicmap: basicmap, basicmap0: basicmap0, webglArray: webglArray, graymap: graymap, rgbcube: rgbcube, rgbmap: rgbmap, hslmap: hslmap, gradientmap: gradientmap, redorange: redorange, cssmap: cssmap });

      util.repeat(5, function (i) {
        var r = c.randomTypedColor();
        var rc = rgbcube.rgbClosestColor.apply(rgbcube, _toConsumableArray(r));
        console.log(i, r.toString(), rc.toString());
      });
    }
  };
});
//# sourceMappingURL=cmap.js.map