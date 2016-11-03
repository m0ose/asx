// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import Color from 'lib/Color.js'
import ColorMap from 'lib/ColorMap.js'
import Model from 'lib/Model.js'
import TileDataSet from 'lib/TileDataSet.js'
import * as dat from 'https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.1/dat.gui.min.js'

window.pps = util.pps

const modules = { Color, ColorMap, Model, util, pps: util.pps }
util.toWindow(modules)
console.log(Object.keys(modules).join(', '))

class FireModel extends Model {
  startup () {
    console.log('startup called')
    // F I R E   M O D E L   V A R I A B L E S
    //   drought
    this.KDBI = 80
    this.RAINFALLmm = 8
    this.DAYS_SINCE_LAST_RAIN = 14
    //   weather
    this.FUEL_LOAD_tpha = 18 // t/ha
    this.DATE = new Date('January 30 2015 15:00')
    this.AIR_TEMP_c = 22 // celsius
    this.RELATIVE_HUMIDITY = 35 // %
    this.WIND_SPEED_10M = 60 // km/hour
    this.WIND_DIRECTION_DEG = 45 // degrees
    // Forest Fire Danger Index FFDI
    this.FINEFUEL_CURRENT_PCT = 6.7 // % . the spreadsheet has values for am pm and more.
    // Finally load elevation
    return this.loadElevations() // this returns a promise. setup will not run until this completes
  }

  setup () {
    console.log('setup')
    this.anim.setRate(60)
    this.elevColorMap = ColorMap.gradientColorMap(1000, ColorMap.jetColors)
    this.modelTime = 0 // seconds
    this.modelTimeStep = 60
    this.squareMburned = 0
    this.stats = []
    this.patches.importDataSet(this.elevation, 'elev', true)
    for (const p of this.patches) {
      p.fuelExausted = false
      p.ignitionTime = 0
    }
    for (const p of this.patches) {
      if ((p.x === 0 && p.y === 0) || (p.x === 40 && p.y === 40)) {
        this.ignite(p)
        console.log('ignite')
      }
    }
    //
    this.computeDerivedConstants()
    this.tests()
    this.initDatGUI()
  }

  computeDerivedConstants () {
    this.DROUGHT_FACTOR = (0.191 * (this.KDBI + 104) * Math.pow(this.DAYS_SINCE_LAST_RAIN + 1, 1.5)) / (3.52 * Math.pow(this.DAYS_SINCE_LAST_RAIN + 1, 1.5) + this.RAINFALLmm - 1)
    const windAdjusted = (90 - this.WIND_DIRECTION_DEG)
    this.WIND_HEAD_DIR = (windAdjusted + 180) % 360
    this.WIND_LFLANK_DIR = (windAdjusted + 90) % 360
    this.WIND_RFLANK_DIR = (windAdjusted + 270) % 360
    this.FFDI = 34.81 * Math.exp(0.987 * Math.log(this.DROUGHT_FACTOR)) * Math.pow(this.FINEFUEL_CURRENT_PCT, -2.1) * Math.exp(0.0234 * this.FINEFUEL_CURRENT_PCT)
  }

  loadElevations (north = -36.5442637, south = -36.5931277, east = 147.6396473, west = 147.7104703) {
    return new Promise((resolve, reject) => {
      const ds = new TileDataSet({
        // url: 'https://s3-us-west-2.amazonaws.com/simtable-elevation-tiles/{z}/{x}/{y}.png',
        north: north,
        south: south,
        west: west,
        east: east,
        maxZoom: 13,
        debug: true,
        callback: (err, val) => {
          if (!err) {
            this.elevation = val
            this.elevationMin = Number.MAX_SAFE_INTEGER
            this.elevationMax = Number.MIN_SAFE_INTEGER
            for (let i = 0; i < this.elevation.data.length; i++) {
              const val = this.elevation.data[i]
              this.elevationMin = Math.min(this.elevationMin, val)
              this.elevationMax = Math.max(this.elevationMax, val)
            }
            this.north = ds.north
            this.south = ds.south
            this.east = ds.east
            this.west = ds.west
            resolve(val)
          } else {
            reject(err)
          }
        }
      })
      console.log(ds)
    })
  }

  step () {
    this.computeDerivedConstants()
    let burnedCount = 0
    for (var p of this.patches) {
      if (!p.fuelExausted && p.ignitionTime < this.modelTime && p.ignitionTime > 0) {
        this.patchStep(p)
      }
      if (p.fuelExausted) burnedCount++
      if (p.ignitionTime > 0) {
        p.color = this.elevColorMap.scaleColor(0.8, 0, 1)
      } else {
        const color = this.elevColorMap.scaleColor(p.elev, this.elevationMin, this.elevationMax)
        if (color) p.color = color
      }
    }
    if (burnedCount > this.world.numX * this.world.numY - 100) {
      model.stop()
    }
    this.modelTime += this.modelTimeStep
    this.updateStats()
    // UI stuff
    this.updateUI()
  }

  patchStep (patch) {
    const neighbors = patch.neighbors
    for (const n of neighbors) {
      const slopeAngle = this.getSlopeAngleBetween(patch, n)
      let ros
      if (this.FFDI < 12.5) {
        ros = this.spreadRateLeaflet80(slopeAngle)
      } else {
        ros = this.spreadRateMK5(slopeAngle)
      }
      const flank = this.flankContributions(patch, n)
      let rosAdjusted = flank.head * ros.rosHeadSlopeAdjusted
      rosAdjusted += flank.back * ros.rosBackingSlopeAdjusted
      rosAdjusted += flank.flank * ros.rosFlankSlopeAdjusted
      let ignitionTime = this.modelTime
      ignitionTime += this.ignitionTimeFromROS(patch, n, rosAdjusted)
      if (ignitionTime > this.modelTime) this.ignite(n, ignitionTime)
    }
    patch.fuelExausted = true
    // calculate km burned
    const lat = this.getLatitudeOfPatch(patch)
    const dims = this.patchDimInMeters(lat)
    const kmsquared = Math.abs(dims[0] * dims[1])
    this.squareMburned += kmsquared
  }

  ignite (p, ignitionTime = 1) {
    if (ignitionTime < p.ignitionTime || p.ignitionTime <= 0) {
      p.ignitionTime = ignitionTime
    }
  }

  ignitionTimeFromROS (p1, p2, ros) {
    const diff = this.getPatchDistanceInMeters(p1, p2)
    const distance = Math.hypot(diff[0], diff[1])
    const rosSeconds = Math.abs(ros) / 3600
    const time = Math.abs(distance / rosSeconds)
    return time
  }

  getSlopeAngleBetween (fromP, toP) {
    const diff = this.getPatchDistanceInMeters(fromP, toP)
    const diffMag = Math.hypot(diff[0], diff[1])
    const dh = toP.elev - fromP.elev
    const angle = Math.atan2(dh, diffMag) * 180 / Math.PI
    return angle
  }

  getPatchDistanceInMeters (fromP, toP) {
    const lat = this.getLatitudeOfPatch(fromP)
    const dims = this.patchDimInMeters(lat)
    return [(toP.x - fromP.x) * dims[0], (toP.y - fromP.y) * dims[1]]
  }

  // what flank is patch in
  //   calculate angle between wind and patch
  flankContributions (fromP, toP) {
    const deg2rad = Math.PI / 180
    const rad2deg = 180 / Math.PI
    const headFlankVec = [Math.cos(deg2rad * this.WIND_HEAD_DIR), Math.sin(deg2rad * this.WIND_HEAD_DIR)]
    const dxdyVec = [toP.x - fromP.x, toP.y - fromP.y]
    const cosTheta = this.dot(headFlankVec, dxdyVec) / (this.norm2(headFlankVec) * this.norm2(dxdyVec))
    const angle = Math.acos(cosTheta) * rad2deg // this angle wil always be positive.
    let ratioHead = 1 - (angle / 90)
    let ratioFlank = angle / 90
    let ratioBack = 0
    if (angle > 90) {
      ratioBack = (angle - 90) / 90
      ratioFlank = 1 - ratioBack
      ratioHead = 0
    }
    const result = {
      'head': ratioHead,
      'flank': ratioFlank,
      'back': ratioBack
    }
    return result
  }

  getCurrentDate () {
    const utc = this.DATE.getTime() + 1000 * this.modelTime
    return new Date(utc)
  }

  getLatitudeOfPatch (p) {
    const W = this.world
    return (this.north - this.south) * ((p.y - W.minY) / (W.maxY - W.minY)) + this.south
  }

  spreadRateLeaflet80 (slopeAngle) {
    var slopeCorrectionFactor = 0 // slope Adjusted Correction Factor
    if (slopeAngle < 0) slopeCorrectionFactor = Math.pow(2, -(slopeAngle / 10)) / (Math.pow(2, 1 - slopeAngle / 10) - 1)
    else slopeCorrectionFactor = Math.exp(0.069 * slopeAngle)
    const fuelAvalabilityFactor = this.DROUGHT_FACTOR / 10 // # 62
    let windSpeedAt1p5m = 1.674 + 0.179 * this.WIND_SPEED_10M// =IF(C15<3,0,1.674+0.179*C15)
    if (windSpeedAt1p5m < 3) windSpeedAt1p5m = 0
    // head
    const rosHeadFlatGround = 0.22 * this.FUEL_LOAD_tpha * Math.exp(0.158 * windSpeedAt1p5m - 0.277 * this.FINEFUEL_CURRENT_PCT) * 60// =0.22*C10*EXP(0.158*C63-0.277*C38)*60
    const rosHeadSlopeAdjusted = rosHeadFlatGround * slopeCorrectionFactor// =C64*C26
    const flameHeightHead = 0.0683 + (0.0225 * rosHeadFlatGround) // =0.0683+(0.0225*C64)
    let scorchHeightHead = -0.296 + (2.23 * Math.sqrt(rosHeadFlatGround))// =IF(C13<20,-2.19+(2.23*SQRT(C64)),-0.296+(2.23*SQRT(C64)))
    if (this.AIR_TEMP_c < 20) scorchHeightHead = -2.19 + (2.23 * Math.sqrt(rosHeadFlatGround))
    const intensityHead = 516.7 * this.FUEL_LOAD_tpha * (this.DROUGHT_FACTOR / 10) * (rosHeadSlopeAdjusted / 1000) // =516.7*C10*C7/10*C65/1000
    // left flank
    const rosFlankFlatGround = 0.22 * this.FUEL_LOAD_tpha * Math.exp(-0.277 * this.FINEFUEL_CURRENT_PCT) * 60 // =0.22*C10*EXP(-0.277*C38)*60
    const rosFlankSlopeAdjusted = rosFlankFlatGround * slopeCorrectionFactor // =C69*C28
    const flameHeightFlank = 0.0683 + (0.0225 * rosFlankFlatGround) // =0.0683+(0.0225 * C69)
    let scorchHeightFlank = -0.296 + (2.23 * Math.sqrt(rosFlankFlatGround))
    if (this.AIR_TEMP_c < 20) {
      scorchHeightFlank = -2.19 + (2.23 * Math.sqrt(rosFlankFlatGround))
    } // =IF(C13<20,-2.19+(2.23 * SQRT(C69)),-0.296+(2.23 * SQRT(C69)))
    const intensityFlank = 516.7 * this.FUEL_LOAD_tpha * this.DROUGHT_FACTOR / 10 * rosFlankSlopeAdjusted / 1000 // =516.7*C10*C7/10*C70/1000
    // Backing
    const rosReductionFactor = -0.0000007 * Math.pow(this.WIND_SPEED_10M, 3) + 0.0002 * Math.pow(this.WIND_SPEED_10M, 2) - 0.02 * this.WIND_SPEED_10M + 1 // =-0.0000007 * C15^3+0.0002 * C15^2-0.02 * C15+1
    const rosBackingFlatGround = (0.22 * this.FUEL_LOAD_tpha * Math.exp(-0.277 * this.FINEFUEL_CURRENT_PCT) * 60) * rosReductionFactor // =(0.22 * C10*EXP(-0.277*C38)*60)*C79
    const rosBackingSlopeAdjusted = rosBackingFlatGround * slopeCorrectionFactor // =C80*C32
    const flameHeightBacking = 0.0683 + (0.0225 * rosBackingFlatGround) // =0.0683+(0.0225*C80)
    let scorchHeightBacking = -0.296 + (2.23 * Math.sqrt(rosBackingFlatGround))
    if (this.FINEFUEL_CURRENT_PCT < 20) {
      scorchHeightBacking = -2.19 + (2.23 * Math.sqrt(rosBackingFlatGround))
    } // =IF(C38<20,-2.19+(2.23*SQRT(C80)),-0.296+(2.23*SQRT(C80)))
    const intensityBacking = 516.7 * this.FUEL_LOAD_tpha * this.DROUGHT_FACTOR / 10 * rosBackingSlopeAdjusted / 1000 // =516.7*C10*C7/10*C81/1000
    return {
      rosHeadFlatGround: rosHeadFlatGround, // head
      rosHeadSlopeAdjusted: rosHeadSlopeAdjusted,
      flameHeightHead: flameHeightHead,
      scorchHeightHead: scorchHeightHead,
      intensityHead: intensityHead,
      rosFlankFlatGround: rosFlankFlatGround, // flank
      rosFlankSlopeAdjusted: rosFlankSlopeAdjusted,
      flameHeightFlank: flameHeightFlank,
      scorchHeightFlank: scorchHeightFlank,
      intensityFlank: intensityFlank,
      rosBackingFlatGround: rosBackingFlatGround, // backing
      rosBackingSlopeAdjusted: rosBackingSlopeAdjusted,
      flameHeightBacking: flameHeightBacking,
      scorchHeightBacking: scorchHeightBacking,
      intensityBacking: intensityBacking
    }
  }

  spreadRateMK5 (slopeAngle) {
    var slopeCorrectionFactor = 0 // slope Adjusted Correction Factor
    if (slopeAngle < 0) slopeCorrectionFactor = Math.pow(2, -(slopeAngle / 10)) / (Math.pow(2, 1 - slopeAngle / 10) - 1)
    else slopeCorrectionFactor = Math.exp(0.069 * slopeAngle)
    const rosReductionFactor = -0.0000007 * Math.pow(this.WIND_SPEED_10M, 3) + 0.0002 * Math.pow(this.WIND_SPEED_10M, 2) - 0.02 * this.WIND_SPEED_10M + 1 // =-0.0000007 * C15^3+0.0002 * C15^2-0.02 * C15+1
    const fuelAvalabilityFactor = this.DROUGHT_FACTOR / 10 // # 62
    const FDI = 34.81 * Math.exp(0.987 * Math.log(this.DROUGHT_FACTOR)) * Math.pow(this.FINEFUEL_CURRENT_PCT, -2.1) // =34.81*EXP(0.987*LN(C7))*C38^-2.1
    const rosHeadFlatGround = 1.2 * this.FFDI * this.FUEL_LOAD_tpha // =1.2*C41*C10
    const rosHeadSlopeAdjusted = rosHeadFlatGround * slopeCorrectionFactor // =C88*C26
    const flameHeightHead = (13 * (rosHeadFlatGround / 1000)) + 0.24 * (this.FUEL_LOAD_tpha * fuelAvalabilityFactor) - 2 // =(13*(C88/1000))+0.24*(C10*C62)-2
    let scorchHeightHead = -0.296 + (2.23 * Math.sqrt(rosHeadFlatGround))
    if (this.AIR_TEMP_c < 20) {
      scorchHeightHead = -2.19 + (2.23 * Math.sqrt(rosHeadFlatGround))
    } // =IF(C13<20, - 2.19 + (2.23 * Math.sqrt(C88)), - 0.296 + (2.23 * Math.sqrt(C88)))
    const intensityHead = 516.7 * this.FUEL_LOAD_tpha * this.DROUGHT_FACTOR / 10 * rosHeadSlopeAdjusted / 1000 // =516.7 * C10 * C7/10 * C89/1000
    const rosFlankFlatGround = 1.2 * FDI * this.FUEL_LOAD_tpha //  =1.2 * C87 * C10
    const rosFlankSlopeAdjusted = rosFlankFlatGround * slopeCorrectionFactor //  =C93 * C28
    const flameHeightFlank = (13 * (rosFlankFlatGround / 1000)) + 0.24 * (this.FUEL_LOAD_tpha * fuelAvalabilityFactor) - 2 //  =(13 * (C93/1000)) + 0.24 * (C10 * C62) - 2
    let scorchHeightFlank = -0.296 + (2.23 * Math.sqrt(rosFlankFlatGround))
    if (this.AIR_TEMP_c < 20) {
      scorchHeightFlank = -2.19 + (2.23 * Math.sqrt(rosFlankFlatGround))
    } //  =IF(C13<20, - 2.19 + (2.23 * Math.sqrt(C93)), - 0.296 + (2.23 * Math.sqrt(C93)))
    const intensityFlank = 516.7 * this.FUEL_LOAD_tpha * this.DROUGHT_FACTOR / 10 * rosFlankSlopeAdjusted / 1000 //  =516.7 * C10 * C7/10 * C94/1000
    const rosBackingFlatGround = rosFlankFlatGround * rosReductionFactor //  =C93 * C79
    const rosBackingSlopeAdjusted = rosBackingFlatGround * this.slopeCorrectionFactor //  =C103 * C32
    const flameHeightBacking = (13 * (rosBackingFlatGround / 1000)) + 0.24 * (this.FUEL_LOAD_tpha * fuelAvalabilityFactor) - 2 //  =(13 * (C103/1000)) + 0.24 * (C10 * C62) - 2
    let scorchHeightBacking = -0.296 + (2.23 * Math.sqrt(rosBackingFlatGround))
    if (this.AIR_TEMP_c < 20) {
      scorchHeightBacking = -2.19 + (2.23 * Math.sqrt(rosBackingFlatGround))
    } //  =IF(C13<20,-2.19+(2.23 * SQRT(C103)),-0.296+(2.23 * SQRT(C103)))
    const intensityBacking = 516.7 * this.FUEL_LOAD_tpha * (this.DROUGHT_FACTOR / 10) * (rosBackingSlopeAdjusted / 1000) //  =516.7*C10*C7/10*C104/1000
    return {
      rosHeadFlatGround: rosHeadFlatGround, // head
      rosHeadSlopeAdjusted: rosHeadSlopeAdjusted,
      flameHeightHead: flameHeightHead,
      scorchHeightHead: scorchHeightHead,
      intensityHead: intensityHead,
      rosFlankFlatGround: rosFlankFlatGround, // flank
      rosFlankSlopeAdjusted: rosFlankSlopeAdjusted,
      flameHeightFlank: flameHeightFlank,
      scorchHeightFlank: scorchHeightFlank,
      intensityFlank: intensityFlank,
      rosBackingFlatGround: rosBackingFlatGround, // backing
      rosBackingSlopeAdjusted: rosBackingSlopeAdjusted,
      flameHeightBacking: flameHeightBacking,
      scorchHeightBacking: scorchHeightBacking,
      intensityBacking: intensityBacking
    }
  }

  // might want to memoize this for speed, or just put it into the gpu.
  patchDimInMeters (lat) {
    // Set up "Constants"
    const m1 = 111132.92		// latitude calculation term 1
    const m2 = -559.82	// latitude calculation term 2
    const m3 = 1.175			// latitude calculation term 3
    const m4 = -0.0023		// latitude calculation term 4
    const p1 = 111412.84		// longitude calculation term 1
    const p2 = -93.5			// longitude calculation term 2
    const p3 = 0.118			// longitude calculation term 3
    // Calculate the length of a degree of latitude and longitude in meters
    const latlen = m1 + (m2 * Math.cos(2 * lat)) + (m3 * Math.cos(4 * lat)) +
      (m4 * Math.cos(6 * lat))
    const longlen = (p1 * Math.cos(lat)) + (p2 * Math.cos(3 * lat)) +
      (p3 * Math.cos(5 * lat))
    // per patch
    const xDim = longlen * Math.abs(this.east - this.west) / Math.abs(this.world.maxX - this.world.minX)
    const yDim = latlen * Math.abs(this.north - this.south) / Math.abs(this.world.maxY - this.world.minY)
    return [xDim, yDim]
  }

  updateUI () {
    let mdt = 0
    if (this.stats.length > 1) {
      const stat = this.stats[this.stats.length - 1]
      mdt = stat.meterPerMillisecond * 1000
    }
    let divStr = `${this.getCurrentDate().toString()}
      <br>
      ${(this.squareMburned / (1000 * 1000)).toFixed(3)} square km burned
      <br>
      ${mdt.toFixed(2)} Square meters per Second
      `
    document.getElementById('timeDisplayDiv').innerHTML = divStr
  }

  updateStats () {
    if (this.anim.ticks % 60 === 0) {
      while (this.stats.length > 20) {
        this.stats.shift()
      }
      let meterPerMillisecond = 0
      if (this.stats.length > 1) {
        const stat = this.stats[this.stats.length - 1]
        const dt = this.getCurrentDate().getTime() - stat.time.getTime()
        const mt = this.squareMburned - stat.squareMburned
        meterPerMillisecond = mt / dt
      }
      this.stats.push({
        squareMburned: this.squareMburned,
        time: this.getCurrentDate(),
        meterPerMillisecond: meterPerMillisecond
      })
    }
  }

  // some vector operations, should maybe go in utils
  dot (vec0, vec1) {
    return vec0[0] * vec1[0] + vec0[1] * vec1[1]
  }

  norm2 (vec) {
    return Math.hypot(vec[0], vec[1])
  }

  tests () {
    // this is for 45 degrees
    console.assert(this.flankContributions(this.patches.patchXY(0, 0), this.patches.patchXY(-1, -1)).head >= 0.5, 'head flank')
    console.assert(this.flankContributions(this.patches.patchXY(0, 0), this.patches.patchXY(1, 1)).back >= 0.5, 'back flank')
    console.assert(this.flankContributions(this.patches.patchXY(0, 0), this.patches.patchXY(-1, 1)).flank >= 0.5, 'right flank')
    console.assert(this.flankContributions(this.patches.patchXY(0, 0), this.patches.patchXY(1, -1)).flank >= 0.5, 'left flank')
    console.assert(this.flankContributions(this.patches.patchXY(0, 0), this.patches.patchXY(-20, -1)).head >= 0.5, 'head flank')
    console.assert(this.flankContributions(this.patches.patchXY(0, 0), this.patches.patchXY(-1, -20)).head >= 0.5, 'head flank')
  }

  initDatGUI () {
    if (window.gewy) return // this gets called on restart also
    window.gewy = new dat.GUI()
    var weather = gewy.addFolder('Weather')
    weather.add(model, 'WIND_DIRECTION_DEG', 0, 360)
    weather.add(model, 'WIND_SPEED_10M', 0, 120) // km/hour
    weather.add(model, 'AIR_TEMP_c', 0, 40) // celsius
    weather.add(model, 'RELATIVE_HUMIDITY', 0, 100) // %
    var fuel = gewy.addFolder('Fuel')
    fuel.add(model, 'KDBI', 10, 200)
    fuel.add(model, 'RAINFALLmm', 0, 30)
    fuel.add(model, 'DAYS_SINCE_LAST_RAIN', 1, 90)
    fuel.add(model, 'FUEL_LOAD_tpha', 1, 70) // t/ha
    fuel.add(model, 'FINEFUEL_CURRENT_PCT', 0, 100)
    gewy.add(model, 'modelTimeStep', 1, 240) // km/hour
    //
    // buttons
    var container = document.createElement('div')
    container.style.cssText = 'position:absolute; left:20px; top:20px; z-index:80'
    var but = document.createElement('button')
    but.innerHTML = 'reset'
    but.onclick = () => { model.reset(); model.start() }
    var but2 = document.createElement('button')
    but2.innerHTML = 'start'
    but2.onclick = () => { model.start() }
    var but3 = document.createElement('button')
    but3.innerHTML = 'stop'
    but3.onclick = () => { model.stop() }
    container.appendChild(but)
    container.appendChild(but2)
    container.appendChild(but3)
    var timeDisp = document.createElement('div')
    timeDisp.id = 'timeDisplayDiv'
    timeDisp.style.background = 'white'
    timeDisp.style.opacity = 0.6
    container.appendChild(timeDisp)
    document.body.appendChild(container)
  }
}
// const [div, size, max, min] = ['layers', 4, 50, -50]
const model = new FireModel('layers', {
  patchSize: 2,
  minX: -125,
  maxX: 125,
  minY: -125,
  maxY: 125
}).start()

// debugging
const world = model.world
const patches = model.patches
util.toWindow({ model, world, patches })
// if (world.patchSize !== 1) util.addToDom(patches.pixels.ctx.canvas)
