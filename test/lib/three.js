System.register(['lib/util.js', 'etc/three.min.js'], function (_export, _context) {
  "use strict";

  var util, THREE;


  function init() {
    const can = document.getElementById('layers');
    const scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(75, can.width / can.height, 0.1, 1000);
    // camera.position.x = 0
    // camera.position.y = 0
    camera.position.z = 30;
    camera.lookAt(scene.position);
    // scene.add(camera)

    const renderer = new THREE.WebGLRenderer();
    // renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0))
    renderer.setSize(can.width, can.height);

    util.toWindow({ can, scene, camera, renderer });

    const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1); // last two segs
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    util.toWindow({ planeGeometry, planeMaterial, plane });

    function render() {
      // console.log(render, scene, camera, renderer)
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    can.appendChild(renderer.domElement);
    render();
  }
  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_etcThreeMinJs) {
      THREE = _etcThreeMinJs;
    }],
    execute: function () {

      util.toWindow({ util, THREE });
      // import 'etc/three.js'
      // import THREE from 'etc/three.js'
      init();
    }
  };
});