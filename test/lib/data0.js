System.register(['lib/util.js', 'node_modules/lzma/src/lzma.js', 'node_modules/pako/dist/pako.js'], function (_export, _context) {
  "use strict";

  var util, lzma, pako;
  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_node_modulesLzmaSrcLzmaJs) {
      lzma = _node_modulesLzmaSrcLzmaJs.default;
    }, function (_node_modulesPakoDistPakoJs) {
      pako = _node_modulesPakoDistPakoJs.default;
    }],
    execute: function () {

      const modules = { util, lzma, pako, pps: util.pps }; // Import the lib/ mmodules via relative paths

      util.toWindow(modules);
      console.log(Object.keys(modules).join(' '));
      const imageUrl = 'test/data/redfish128t.png'; // 26k

      function lzmaCompressPromise(lzma, data, level) {
        return new Promise((resolve, reject) => {
          lzma.compress(data, level);
          img.onload = () => resolve(img);
          img.onerror = () => reject(this.error(`Could not load image ${ url }`));
          img.src = url;
        });
      }
      util.imagePromise(imageUrl).then(img => {
        // debugger
        const pixels = util.imageToPixels(img, true);
        const pix = LZMA.compress(pixels, 9);
        console.log('LZMA: pixels compression', pixels.length, pix.length);
        const pixd = LZMA.decompress(pix);
        console.log('LZMA: pixels = pixd', util.arraysEqual(pixels, pixd));
        util.toWindow({ img, pixels, pix, pixd });

        // const pixInt8 = new Int8Array(pix)
        // console.log('LZMA: pix = pixInt8', util.arraysEqual(pix, pixInt8))
        // const pixUint8 = new Uint8Array(pix) // Uint & Int same values
        // const pixd8 = LZMA.decompress(new Int8Array(pixUint8.buffer))
        // console.log('LZMA: pixels = pixd8', util.arraysEqual(pixels, pixd8))
        // const pixelsbas64 = util.bufferToBase64(pixels)
        // const pixbase64 = util.bufferToBase64(pixUint8)
        // console.log('LZMA: base64 compression', pixelsbas64.length, pixbase64.length)
        // util.toWindow({ pixelsbas64, pixInt8, pixUint8, pixbase64, pixd8 })
        // console.log('img', img, 'pixels', pixels.length)
      }).catch(response => console.log(response));

      // const id = new ImageData(10, 5)
      // util.repeat(id.data.length, (i) => { id.data[i] = i })
      // const idpx = util.imageToPixels(id)
      // const idbase64 = util.bufferToBase64(idpx)
      // util.toWindow({ id, idpx, idbase64 })
      //
      // const blob = new Blob([idpx], {type: 'application/octet-binary'})
      // const bloburl = URL.createObjectURL(blob)
      // util.toWindow({ blob, bloburl })
    }
  };
});