<themap>
  <div id='layers'> </div>
  <div id='mapDiv'></div>
  <div id='mybuttons'>
    <button if={ mode == 'DRAW_VECTOR' } onclick={ modeChange.bind( this, 'MOVE') } >Move Area</button>
    <button if={ mode == 'DRAW_VECTOR' } onclick={ resetVectors } >Reset</button>
    <br>
    <button if={ mode == 'MOVE' } onclick={ modeChange.bind( this, 'DRAW_VECTOR') } >OK</button>
    <h5 if={ mode == 'DOWNLOADING' }> Downloading Data </h5>
  </div>
  <script>
  console.log('UI hello')
  this.modes = {MOVE: 'MOVE', DOWNLOADING: 'DOWNLOADING', DRAW_VECTOR: 'DRAW_VECTOR'}
  this.mode = this.modes.DRAW_VECTOR

  resetVectors () {
    model.updateBoundaries()
  }

  modeChange (type) {
    if (type == this.modes.MOVE) {
      myMap.dragging.enable()
      myMap.zoomControl.enable()
      model.stop()
      this.mode = this.modes.MOVE
    } else if (type == this.modes.DRAW_VECTOR) {
      myMap.dragging.disable()
      myMap.zoomControl.disable()
      if (this.mode != this.modes.DRAW_VECTOR) {
        this.mode = this.modes.DOWNLOADING
        const bounds = myMap.getBounds()
        model.loadElevations(bounds.getNorth(), bounds.getSouth(), bounds.getEast(), bounds.getWest())
          .then( ()=>{
            model.updateBoundaries()
            // this is kind of duplicated
            const w = bounds.getEast() - bounds.getWest()
            const h = bounds.getNorth() - bounds.getSouth()
            this.mode = type
            let params = {
              a: w/model.world.pxWidth, b: 0.0, c: bounds.getWest(),
              d: 0.000, e: -h/model.world.pxHeight, f: bounds.getNorth()
            }
            overlay.parseParams(params)
            this.update()
            model.start()
          }, (err) => {
            alert('failed to load data')
            mode = this.modes.DRAW_VECTOR
          })
      }
    }
  }
  </script>

  <style scoped>
    :scope { font-size: 2rem }
    #mybuttons {
      color: #444;
      z-index: 1000;
      position: absolute;
      right: 80px;
      top: 10px;
    }
    #mapDiv {
      height: 100%;
      width: 100%;
    }
    button {
      padding: 10px;
      height:150%;
      width:100%;
      font-size: 14pt;
    }
  </style>
</themap>
