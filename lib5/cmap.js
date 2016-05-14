'use strict';

System.register(['./Color.js', './ColorMap.js', './util.js'], function (_export, _context) {
  var Color, ColorMap, util, _util$Color$ColorMap, u, c, cmap, gid, gic, c0, rgbs, trgbs, rgbcmap, rgbcmap0, webglArray;

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

      // u.step(10, 2, (i) => console.log(i))
      gid = cmap.gradientImageData(10, ['red', 'green']);

      console.log('gradientImageData', gid);
      // const gia = cmap.uint8ArrayToUint8s(gid)
      // console.log('gradientImageArrays', u.arraysToString(gia))

      gic = cmap.typedArrayToTypedColors(gid);

      console.log('gradientImageColors', u.arraysToString(gic));

      c0 = gic[0];

      console.log('color0', c0, c0.getPixel(), c0.getString());

      rgbs = cmap.permuteRGBColors(2, 2, 3);

      console.log('permuteRGBColors(2,2,3)', u.arraysToString(rgbs));
      console.log('permuteRGBColors length)', rgbs.length);

      trgbs = cmap.arrayToColors(rgbs);

      console.log('arrayToColors', u.arraysToString(trgbs));

      rgbcmap = cmap.basicColorMap(rgbs);

      console.log('rgbcmap');util.pps(rgbcmap);
      rgbcmap0 = rgbcmap[0];

      console.log('rgbcmap[0]', rgbcmap0);util.pps(rgbcmap0);

      console.log('lookup rgbcmap[5]', rgbcmap.lookup(rgbcmap[5]));
      rgbcmap.createIndex();
      console.log('lookup rgbcmap[5] w/ index', rgbcmap.lookup(rgbcmap[5]));

      console.log('random color', rgbcmap.randomColor());

      console.log('scaleColor(i, 0, 5) for i in [0, 5]');
      util.repeat(6, function (i) {
        var c = rgbcmap.scaleColor(i, 0, 5);
        var ix = rgbcmap.lookup(c);
        console.log('c', c, 'i', i, 'ix', ix);
      });

      webglArray = rgbcmap.webglArray();

      console.log('webglArray', webglArray);

      util.copyTo(window, { gid: gid, gic: gic, c0: c0, rgbs: rgbs, trgbs: trgbs, rgbcmap: rgbcmap, rgbcmap0: rgbcmap0, webglArray: webglArray });
    }
  };
});
//# sourceMappingURL=cmap.js.map