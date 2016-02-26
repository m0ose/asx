const util = {
  error (str) { throw new Error(str) },
  // Return true if val in [min, max] (includive/closed interval)
  isIn (val, min, max) { return val >= min && val <= max },
}

export default util
