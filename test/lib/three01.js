System.register(['lib/util.js', 'etc/three.min.js'], function (_export, _context) {
  "use strict";

  var util, THREE, scene, camera, renderer;

  // var geometry, material, mesh

  function initThree() {
    const [width, height] = [600, 400];
    const div = document.getElementById('layers');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.z = 400;

    const geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000, side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    div.appendChild(renderer.domElement);

    util.toWindow({ div, scene, camera, renderer, geometry, material, mesh });
  }

  function animate() {
    requestAnimationFrame(animate);
    // const mesh = scene.children[0]
    // mesh.rotation.x += 0.01
    // mesh.rotation.y += 0.02
    renderer.render(scene, camera);
  }

  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_etcThreeMinJs) {
      THREE = _etcThreeMinJs;
    }],
    execute: function () {

      util.toWindow({ util, THREE });initThree();
      animate();
    }
  };
});