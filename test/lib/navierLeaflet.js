"use strict";

System.register(["https://npmcdn.com/leaflet@1.0.0-rc.3/dist/leaflet.js", "./navier.js", "./WorldFile.js"], function (_export, _context) {
  var L, model, ElementOverlay;


  function initMap() {
    window.myMap = L.map('mapDiv').setView([42, -105], 10);
    myMap.options.minZoom = 8;
    myMap.options.maxZoom = 14;
    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { //'http://{s}.tiles.mapbox.com/v3/MapID/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(myMap);
    const b = model.elevation;
    const bounds = new L.LatLngBounds([b.south, b.west], [b.north, b.east]);
    console.log(bounds);
    myMap.fitBounds(bounds);
    myMap.zoomControl.disable();
    const div = document.getElementById('layers');
    // get the mouse right
    myMap.dragging.disable();
    div.style['pointer-events'] = 'all';
    // position
    const w = bounds.getEast() - bounds.getWest();
    const h = bounds.getNorth() - bounds.getSouth();
    window.overlay = new L.WorldFile({
      image: div,
      params: {
        a: w / model.world.pxWidth, b: 0.0, c: bounds.getWest(),
        d: 0.000, e: -h / model.world.pxHeight, f: bounds.getNorth()
      },
      opacity: 0.5
    }).addTo(myMap);
  }

  function checkIfModelReady() {
    if (model.elevation) {
      console.log('MODEL READY');
      initMap();
    } else {
      setTimeout(checkIfModelReady, 400);
    }
  }
  return {
    setters: [function (_httpsNpmcdnComLeaflet100Rc3DistLeafletJs) {
      L = _httpsNpmcdnComLeaflet100Rc3DistLeafletJs.default;
    }, function (_navierJs) {
      model = _navierJs.default;
    }, function (_WorldFileJs) {
      ElementOverlay = _WorldFileJs.default;
    }],
    execute: function () {

      console.log('hello');setTimeout(checkIfModelReady, 100);
    }
  };
});