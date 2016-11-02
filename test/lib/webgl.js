System.register(['lib/util.js', 'lib/glx.js', 'etc/three.min.js', 'etc/webgl-debug.js'], function (_export, _context) {
  "use strict";

  var util, glx, THREE, webglDebug;
  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_libGlxJs) {
      glx = _libGlxJs.default;
    }, function (_etcThreeMinJs) {
      THREE = _etcThreeMinJs;
    }, function (_etcWebglDebugJs) {
      webglDebug = _etcWebglDebugJs.default;
    }],
    execute: function () {
      // util.setScript('etc/three.js')

      // import 'etc/three.js'
      // import THREE from 'etc/three.js'
      console.log('THREE', THREE);
      if (THREE) window.three = THREE;

      util.toWindow({ util, glx, webglDebug });

      const gl = glx.addDebugWrappers(glx.getGLContext('can'), webglDebug, true);
      console.log(gl.getSupportedExtensions());

      const fragmentShader = `
  precision mediump float;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1);
  }
`;
      const vertexShader = `
  attribute vec3 aPosition;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    gl_Position = vec4(aPosition, 1);
    gl_PointSize = 10.0;
  }
`;
      var program = glx.createProgram(gl, vertexShader, fragmentShader);
      util.toWindow({ gl, program, fragmentShader, vertexShader });

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const data = {
        aPosition: [0, 0, 0],
        aColor: [0, 1, 0]
      };
      const buffInfo = glx.initBuffers(gl, program);
      util.toWindow({ buffInfo, data });
      glx.setBuffers(gl, program, buffInfo, data);

      gl.drawArrays(gl.POINTS, 0, 1); // draw point; Warning Attrib 0 disabled
    }
  };
});