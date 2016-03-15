// arraySpecs:
//    name: arrayType - name is a simple array of given type
//      equivalent to [arrayType, 1]
//    name: [arrayType, num] - name is an array of arrays of num elements
//      arrayType has to be a typed array. If Array is to contain arrays,
//      they should be array objects of size num, not num elements from array.
//    name: [value, 0] - name is a constant value, not an array of values.

class OofA {
  constructor(arraySpecs, initSize = 100, sizeDelta = 100) {
    this.length = 0
    this.size = 0
    this.specs = {}
    this.initSize = initSize
    this.sizeDelta = sizeDelta
    this.arrays = {}
    this.initArrays(arraySpecs)
  }
  initArrays(arraySpecs) {
    for (const key in arraySpecs) { // eslint-disable-line guard-for-in
      let val = arraySpecs[key]
      if (!Array.isArray(val)) val = [val, 1]
      const [Type, elements] = val // type caps: a ctor
      this.specs[key] = { Type, elements }

      if (Type === Array && elements !== 1)
        throw 'OofA initArrays: JavaScript Arrays must have "elements" = 1'

      if (elements === 0)
        this.arrays[key] = Type
      else
        this.arrays[key] = new Type(this.initSize * elements)
    }
    this.size = this.initSize
  }
  extendArrays() {
    this.size += this.sizeDelta
    for (const key in this.arrays) { // eslint-disable-line guard-for-in
      const { Type, elements } = this.specs[key]
      if (elements === 0) continue

      const array = this.arrays[key]
      if (Type === Array) {
        array[this.size - 1] = undefined // continue? sparse querks?
      } else {
        this.arrays[key] = new Type(this.size * elements)
        this.arrays[key].set(array)
      }
    }
  }
  arrayNames() { return Object.keys(this.arrays) }

  getSubArrayAt(ix, key) {
    const array = this.arrays[key]
    const { elements } = this.specs[key]
    if (elements < 2)
      throw `getSubArrayAt: ${key} not a subarray`
    const start = ix * elements
    const end = start + elements
    return array.subarray(start, end)
  }
  setSubArrayAt(ix, key, val) {
    const array = this.arrays[key]
    const { elements } = this.specs[key]
    if (elements < 2)
      throw `setSubArrayAt: ${key} not a subarray`
    if (val.length !== elements)
      throw `setSubArrayAt: value not an array of ${elements} elements`
    array.set(val, ix * elements)
  }
  getValueAt(ix, key) {
    const { elements } = this.specs[key]
    const array = this.arrays[key]
    if (elements === 0) return array
    if (elements === 1) return array[ix]
    return this.getSubArrayAt(ix, key)
  }
  setValueAt(ix, key, val) {
    const { elements } = this.specs[key]
    const array = this.arrays[key]
    if (elements === 0) { this.arrays[key] = val; return }
    if (elements === 1) { array[ix] = val; return }
    this.setSubArrayAt(ix, key, val)
  }

  getValuesAt(ix) {
    const ret = {}
    for (const key in this.arrays) // eslint-disable-line guard-for-in
      ret[key] = this.getValueAt(ix, key)
    return ret
  }
  setValuesAt(arrayValues, ix) {
    for (const key in arrayValues) // eslint-disable-line guard-for-in
      this.setValueAt(ix, key, arrayValues[key])
  }
  pushValues(arrayValues) {
    if (this.length === this.size) this.extendArrays()
    this.setValuesAt(arrayValues, this.length)
    this.length++
  }

  getterSetter() {
    const obj = { ix: 0 }
    const arrays = this.arrays
    for (const key in arrays) { // eslint-disable-line guard-for-in
      const { elements } = this.specs[key]
      if (elements === 0)
        Object.defineProperty(obj, key, {
          get: () => arrays[key],
          set: (val) => {arrays[key] = val}, // {}: avoid return undef
        })
      if (elements === 1)
        Object.defineProperty(obj, key, {
          get: () => arrays[key][obj.ix],
          set: (val) => {arrays[key][obj.ix] = val}, // {}: avoid return undef
        })
      if (elements > 1)
        Object.defineProperty(obj, key, {
          get: () =>
            arrays[key].subarray(obj.ix * elements, (obj.ix + 1) * elements),
          set: (val) => arrays[key].set(val, obj.ix * elements),
        })
    }
    return obj
  }
  accessor(gs, ix) {
    gs.ix = ix; return gs
  }
}

export default OofA
