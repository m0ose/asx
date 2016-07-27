

var w = new Worker('test/apps/navier-worker.js')
w.onmessage = function(ev) {
  console.log('message back', ev)
  var data = ev.data
  if(data.byteLength) {
    var dataView = new Float32Array(data)
    console.log(dataView)
  }
}
var a = new Uint16Array(100)
w.postMessage( a.buffer, [a.buffer] )
