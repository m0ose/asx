// OofA = Object of Arrays.
//
// Generally arrays of objects (AofO) are used for homogeneous data instances.
//
// OofA is an alternative that uses a single Object who's values represent  a
// single variable's values. This quirky idea is usefull for drasticly reduced
// memory footprint, and for being WebGL-friendly.
//
// This is an experimental module implementing OofA as a class

class OofA {
  // The constructor has three parameters:
  //
  // arraySpecs: Define the Object's data arrays.
  // The arrays can be TypedArrays, standard JavaScript Arrays, or constants.
  //
  // initSize: the initial size used for [TypedArrays](https://goo.gl/3OOQzy)
  //
  // sizeDelta: how much to grow the TypedArrays when they overflow.
  constructor(arraySpecs, initSize = 100, sizeDelta = 100) {
    // arraySpec details: Three forms are used.
    //
    // The "key" is the name of the array. The values are brackets specifying
    // formats for the Object's arrays.
    // * key: [arrayType, 1] - key is a simple array of given type.
    //   A shortcut is key: arrayType .. w/o the brackets.
    // * key: [arrayType, num] - name is an array of arrays of num elements
    //   arrayType has to be a typed array. If Array is to contain arrays,
    //   they should be array objects of size num, not num elements from array.
    // * key: [value, 0] - name is a constant value, not an array of values.

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

  // Grow the TypedArrays by sizeDelta
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

  // Return the array names, the Object's keys.
  arrayNames() { return Object.keys(this.arrays) }

  // Get a subarray at the position ix for the array of arrays of the key
  getSubArrayAt(ix, key) {
    const array = this.arrays[key]
    const { elements } = this.specs[key]
    if (elements < 2)
      throw `getSubArrayAt: ${key} not a subarray`
    const start = ix * elements
    const end = start + elements
    return array.subarray(start, end)
  }

  // Set for the above.
  setSubArrayAt(ix, key, val) {
    const array = this.arrays[key]
    const { elements } = this.specs[key]
    if (elements < 2)
      throw `setSubArrayAt: ${key} not a subarray`
    if (val.length !== elements)
      throw `setSubArrayAt: value not an array of ${elements} elements`
    array.set(val, ix * elements)
  }

  // Get/Set values at ix for a given key. Can be constant, simple array,
  // or array of subarrays.
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

  // Get/Set/push all the values at a given index, ix, as an object.
  // The arrayValues object uses the OofA keys. This is a "slice"
  // of the OofA as an instance object
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

  // An alternative technique for get/set values at a given indes.
  // The getterSetter is an object using an index, ix, and getter/setters
  // for each of the keys in the OofA.
  //
  // This makes the OofA mimic an AofO.
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
