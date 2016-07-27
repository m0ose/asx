
console.log('hello')
if ('undefined' !== typeof WorkerGlobalScope) {
  console.log('worker')
    // not in worker
}

self.onmessage = function(e) {
  console.log('woo',e)
  var data = e.data
  //var uInt8View = new Uint8Array(e.data);
  if (data.byteLength) {console.log('its a buffer')}
  var dataView = new Float32Array(data)
  for(var i=0; i<dataView.length; i++) dataView[i] = Math.random()
  self.postMessage(dataView.buffer, [dataView.buffer])
};

self.onerror = function(message) {
  log('worker error');
};
