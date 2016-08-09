<themap>
  <div id='layers'> </div>
  <div id='mapDiv'></div>
  <div id='mybuttons'>
    <span if={ mode != 'DOWNLOADING' }>
      <button class={ hotButton : (mode == 'MOVE') } onclick={ modeChange.bind( this, 'MOVE') } >Move</button>
      <button disabled={ mode != 'MOVE' } onclick={ modeChange.bind( this, 'DOWNLOADING') } >Make this AOI</button>
      <button class={ hotButton : (mode == 'DRAW_VECTOR') } onclick={ modeChange.bind( this, 'DRAW_VECTOR') } >Draw Vector</button>
      <button class={ hotButton : (mode == 'DRAW_PARTICLES') } onclick={ modeChange.bind( this, 'DRAW_PARTICLES') } >Draw Particles</button>
      <button onclick={ resetVectors } >Reset</button>
    </span>
    <h5 if={ mode == 'DOWNLOADING' }> Downloading Data </h5>
  </div>


  <script>
  console.log('UI hello')
  this.modes = {MOVE: 'MOVE', DOWNLOADING: 'DOWNLOADING', DRAW_VECTOR: 'DRAW_VECTOR', DRAW_PARTICLES:'DRAW_PARTICLES'}
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
      model.onMouse = () => {}
    } else if (type == this.modes.DRAW_VECTOR) {
      model.start()
      myMap.dragging.disable()
      myMap.zoomControl.disable()
      model.onMouse = model.onMouse_Vector
      this.mode = this.modes.DRAW_VECTOR
    } else if (type == this.modes.DRAW_PARTICLES) {
      model.start()
      myMap.dragging.disable()
      myMap.zoomControl.disable()
      model.onMouse = model.onMouse_Particle
      this.mode = this.modes.DRAW_PARTICLES
    }
    else if (type == this.modes.DOWNLOADING) {
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
