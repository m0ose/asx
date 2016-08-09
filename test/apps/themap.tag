<themap>
  <div id='layers'> </div>
  <div id='mapDiv'></div>
  <div id='mybuttons'>
    <span if={ mode != 'DOWNLOADING' }>
      <button class={ hotButton : (mode == 'MOVE') } onclick={ modeChange.bind( this, 'MOVE') } >Move</button>
      <button class={ hotButton : (mode == 'DRAW_VECTOR') } onclick={ modeChange.bind( this, 'DRAW_VECTOR') } >Draw Vector</button>
      <button if={ mode == 'DRAW_VECTOR' } onclick={ resetVectors } >Reset</button>
      <button if ={ mode == 'MOVE' } onclick={ modeChange.bind( this, 'DOWNLOADING') } >Make this AOI</button>
    </span>
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
    if (type == this.mode) {
      return
    }
    if (type == this.modes.MOVE) {
      myMap.dragging.enable()
      myMap.zoomControl.enable()
      model.stop()
      this.mode = this.modes.MOVE
    } else if (type == this.modes.DRAW_VECTOR) {
      model.start()
      myMap.dragging.disable()
      myMap.zoomControl.disable()
      model.mouseMode = model.MOUSE_MODES.VECTORS
      this.mode = this.modes.DRAW_VECTOR
    } else if (type == this.modes.DOWNLOADING) {
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
          this.modeChange(this.modes.DRAW_VECTOR)
          this.update()
          console.log(this, this.mode)
        }).catch((err) => {
          alert('failed to load data')
          this.modeChange(this.modes.MOVE)
          this.update()
        })
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
      width:100pt
    }
    #mapDiv {
      height: 100%;
      width: 100%;
    }
    button {
      padding: 10px;
      width:110pt;
      font-size: 13pt;
    }
    .hotButton {
      background-color: grey;
      border: 1px solid red;
      border-radius: 3px;
    }
  </style>
</themap>
