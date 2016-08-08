import L from "https://npmcdn.com/leaflet@1.0.0-rc.3/dist/leaflet.js"
import model from "./navier.js"
import ElementOverlay from "./WorldFile.js"

console.log('hello')

function initMap () {
  window.myMap = L.map('mapDiv').setView([42, -105], 10)
  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',{//'http://{s}.tiles.mapbox.com/v3/MapID/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  }).addTo(myMap)
  const b = model.elevation
  const bounds = new L.LatLngBounds([b.south, b.west], [b.north, b.east])
  console.log(bounds)
  myMap.fitBounds(bounds)
  const div = document.getElementById('layers')
  // get the mouse right
  myMap.dragging.disable()
  div.style['pointer-events'] = 'all'
  // position
  const w = bounds.getEast() - bounds.getWest()
  const h = bounds.getNorth() - bounds.getSouth()
  window.overlay = new L.WorldFile({
    image: div,
    params: {
      a: w/model.world.pxWidth, b: 0.0, c: bounds.getWest(),
      d: 0.000, e: -h/model.world.pxHeight, f: bounds.getNorth()
    },
    opacity: 0.5
  }).addTo(myMap)
  // const overlay = L.elementOverlay( div, bounds, {opacity:0.5}).addTo(myMap)
}

function checkIfModelReady () {
  if (model.elevation) {
    console.log('MODEL READY')
    initMap()
  } else {
    setTimeout(checkIfModelReady, 400)
  }
}
setTimeout(checkIfModelReady, 100)
