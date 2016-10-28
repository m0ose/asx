// Import the lib/ mmodules via relative paths
import util from 'lib/util.js'
import Color from 'lib/Color.js'
import ColorMap from 'lib/ColorMap.js'
import Model from 'lib/Model.js'
import TileDataSet from 'lib/TileDataSet.js'
window.pps = util.pps

const modules = { Color, ColorMap, Model, util, pps: util.pps }
util.toWindow(modules)
console.log(Object.keys(modules).join(', '))

class FireModel extends Model {
  startup () {
    console.log('startup called')
    return this.loadElevations() // this returns a promise. setup will not run until this completes
  }

  setup () {
    console.log('setup')
    this.patchBreeds('fires embers')
    this.anim.setRate(60)
    this.elevColorMap = ColorMap.gradientColorMap(1000, ColorMap.jetColors)
    this.modelTime = 0
    this.modelTimeStep = 10000
    this.embers = []
    this.patches.importDataSet(this.elevation, 'elev', true)
    for (const p of this.patches) {
      if (p.x > -10 && p.x < 10 && p.y > -10 && p.y < 10) {
        this.ignite(p)
      }
      p.isTree = true
      p.ignitionTime = 0
    }
    for (const p of this.patches) {
      const color = this.elevColorMap.scaleColor(p.elev, this.elevationMin, this.elevationMax)
      if (color) p.color = color
    }
    //
    // F I R E   M O D E L   C O N S T A I N T S
    //   drought
    this.KDBI = 80
    this.RAINFALLmm = 8
    this.DAYS_SINCE_LAST_RAIN = 3
    //   weather
    this.FUEL_LOAD_tpha = 18 // t/ha
    this.DATE = new Date('January 30 2015 15:00')
    this.AIR_TEMP_c = 22 // celsius
    this.RELATIVE_HUMIDITY = 35 // %
    this.WIND_SPEED_10M = 20 // km/hour
    this.WIND_DIRECTION_DEG = 350 // degrees
    // Forest Fire Danger Index FFDI
    this.FINEFUEL_CURRENT_PCT = 6.7 // % . the spreadsheet has values for am pm and more.
    this.FLANKS = {left: 'left', head: 'head', right: 'right', back: 'back'}
    //
    this.computeDerivedConstants()
  }

  computeDerivedConstants () {
    this.DROUGHT_FACTOR =(0.191 * (this.KDBI + 104) * Math.pow(this.DAYS_SINCE_LAST_RAIN + 1, 1.5)) / (3.52 * Math.pow(this.DAYS_SINCE_LAST_RAIN + 1, 1.5) + this.RAINFALLmm - 1)
    this.WIND_HEAD_DIR = (this.WIND_DIRECTION_DEG + 180) % 360
    this.WIND_LFLANK_DIR = (this.WIND_DIRECTION_DEG + 90) % 360
    this.WIND_RFLANK_DIR = (this.WIND_DIRECTION_DEG + 270) % 360
    this.FFDI = 34.81*Math.exp(0.987*Math.log(this.DROUGHT_FACTOR))*Math.pow(this.FINEFUEL_CURRENT_PCT, -2.1)*Math.exp(0.0234*this.FINEFUEL_CURRENT_PCT)
  }

  // ak coast north = 60.0, south = 59.29, east = -151.37, west = -152.58
  // Australia : ll = -36.5931277,147.6396473, ur = -36.5442637,147.7104703
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
            this.dhdx = this.elevation.dzdx()
            this.dhdy = this.elevation.dzdy()
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

    this.modelTime += this.modelTimeStep
  }

  ignite (p) {
    p.ignitionTime = this.modelTime || 1 // just if modelTime is zero step forward 1 millisecond.
    this.embers.push(p)
  }

  getSlopeAngleBetween (fromP, toP) {
    const lat = this.getLatitudeOfPatch(fromP)
    const dims = this.patchDimInMeters(lat)
    const diff = [(toP.x - fromP.x) * dims[0], (toP.y - fromP.y) * dims[1]]
    const diffMag = Math.hypot(diff[0], diff[1])
    const dh = toP.elev - fromP.elev
    const angle = Math.atan2(dh, diffMag)
    return angle
  }

  whatFlank (fromP, toP) {
    // what flank is patch in
    //   calculate angle between wind and patch
    const headFlankVec = [Math.cos(this.WIND_HEAD_DIR), Math.sin(this.WIND_HEAD_DIR)]
    const dxdyVec = [toP.x - fromP.x, toP.y - fromP.y]
    const cosTheta = this.dot(headFlankVec, dxdyVec) / (this.norm2(headFlankVec) * this.magnitude(dxdyVec))
    const angle = Math.acos(cosTheta) * 180 / Math.PI // angle between 2
    let flank = undefined
    if (angle <= -135) {
      flank = this.FLANKS.back// back flank
    } else if (angle <= -45) {
      flank = this.FLANKS.left// left flank
    } else if (angle <= 45) {
      flank = this.FLANKS.head// head
    } else if (angle <= 135) {
      flank = this.FLANKS.left// right flank
    } else {
      flank = this.FLANKS.back// back flank
    }
    return flank
  }
  // determine which fuel model you are in
  // calculate spread.
  // set time in future for patch to ignite
  getLatitudeOfPatch (p) {
    const W = this.world
    return (this.north - this.south) * ((p.y - W.minY) / (W.maxY - W.minY)) + this.south
  }

  leaflet80(p) {
    const neighbors = p.neighbors
    for (const n of neighbors) {
      // const flank = this.whatFlank(p, n)
    }
  }

  calcLeaflet80 (fromP, toP) {
    const slopeAngle = this.slopeAngle(fromP, toP)
    var sacf = 0 // slope Adjusted Correction Factor
    if (slopeAngle < 0) sacf = Math.pow(2, -(slopeAngle / 10)) / (Math.pow(2, 1 - slopeAngle / 10) - 1)
    else sacf = Math.exp(0.069 * slopeAngle)
    const fuelAvalabilityFactor = this.DROUGHT_FACTOR/10 // # 62
    let windSpeedAt1_5m = 1.674+0.179*this.WIND_SPEED_10M// =IF(C15<3,0,1.674+0.179*C15)
    if (windSpeedAt1_5m < 3) windSpeedAt1_5m = 0
    // head
    let rosHeadFlatGround = 0.22 * this.FUEL_LOAD_tpha * Math.exp(0.158 * windSpeedAt1_5m - 0.277 * this.FINEFUEL_CURRENT_PCT) * 60// =0.22*C10*EXP(0.158*C63-0.277*C38)*60
    const rosHeadFireAdjusted = rosHeadFlatGround * sacf// =C64*C26
    const flameHeightHead = 0.0683 + (0.0225 * rosHeadFlatGround)// =0.0683+(0.0225*C64)
    let scorchHeightHead = -0.296 + (2.23 * Math.sqrt(rosHeadFlatGround))// =IF(C13<20,-2.19+(2.23*SQRT(C64)),-0.296+(2.23*SQRT(C64)))
    if (this.AIR_TEMP_c < 20) scorchHeightHead = -2.19 + (2.23 * Math.sqrt(rosHeadFlatGround))
    const intensityHead = 516.7 * this.FUEL_LOAD_tpha * this.DROUGHT_FACTOR / 10 * rosHeadFireAdjusted / 1000 // =516.7*C10*C7/10*C65/1000
    // left flank
    const rosFlankFlatGround = 0.22*st.FUEL_LOAD_tpha*Math.exp(-0.277*this.FINEFUEL_CURRENT_PCT)*60 // =0.22*C10*EXP(-0.277*C38)*60
    const rosFlankSlopeAdjusted = C69*C28 // =C69*C28
    const flameHeightFlank = 0.0683+(0.0225*C69) // =0.0683+(0.0225*C69)
    let scorchHeightFlank = IF(C13<20,-2.19+(2.23*SQRT(C69)),-0.296+(2.23*SQRT(C69))) // =IF(C13<20,-2.19+(2.23*SQRT(C69)),-0.296+(2.23*SQRT(C69)))
    const intensityFlank = 516.7*st.FUEL_LOAD_tpha*C7/10*C70/1000 // =516.7*C10*C7/10*C70/1000
    // Backing
    const rosReductionFactor = -0.0000007*C15^3+0.0002*C15^2-0.02*C15+1 // =-0.0000007*C15^3+0.0002*C15^2-0.02*C15+1
    const rosBackingFlatGround = (0.22*st.FUEL_LOAD_tpha*Math.exp(-0.277*this.FINEFUEL_CURRENT_PCT)*60)*rosReductionFactor // =(0.22*C10*EXP(-0.277*C38)*60)*C79
    const rosBackingAdjustedFlatGround = C80*C32 // =C80*C32
    const flameHeightBacking = 0.0683+(0.0225*C80) // =0.0683+(0.0225*C80)
    let scorchingHeightBacking = IF(C38<20,-2.19+(2.23*SQRT(C80)),-0.296+(2.23*SQRT(C80))) // =IF(C38<20,-2.19+(2.23*SQRT(C80)),-0.296+(2.23*SQRT(C80)))
    const intensityBacking = 516.7*st.FUEL_LOAD_tpha*C7/10*C81/1000 // =516.7*C10*C7/10*C81/1000
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

  // some vector operations, should maybe go in utils
  dot (vec0, vec1) {
    return vec0[0] * vec1[0] + vec0[1] * vec1[1];
  }

  norm2 (vec) {
    return math.hypot(vec[0], vec[1])
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
