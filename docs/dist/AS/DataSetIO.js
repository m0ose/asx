// Export/Import DataSets
// import DataSet from './DataSet.js'
import util from './util.js'
import DataSet from './DataSet.js'

// Private utility functions:

// Create a legal dataset JSON object, defaulting to base64 data string.
// This is the object that JSON.stringify will use for IO
function jsonObject (dataset, useBase64, meta) {
  return {
    width: dataset.width,
    height: dataset.height,
    data: arrayToString(dataset.data, useBase64),
    dataType: dataset.dataType().name,
    meta: meta
  }
}
// Convert an array, Typed or JS, to a string for dataset's data array
function arrayToString (array, useBase64) {
  if (useBase64) {
    const data = util.arrayToBuffer(array)
    return util.bufferToBase64(data)
  }
  return JSON.stringify(util.convertArray(array, Array))
}
// Convert a string, base64 or JSON, to an array of the given Type
function stringToArray (string, dataTypeName) {
  const dataType = window[dataTypeName]
  if (isBase64(string)) {
    const uint8array = util.base64ToBuffer(string)
    return util.bufferToArray(uint8array, dataType)
  }
  return util.convertArray(JSON.parse(string), dataType)
}
function isBase64 (arrayString) {
  // Base64 does not allow '[', only A-Z, a-z, 0-9, +, /
  // https://en.wikipedia.org/wiki/Base64
  return arrayString[0] !== '['
}

const DataSetIO = {
  // JSON import/export. The JSON returned looks like:
  // ```
  // {
  //   width: dataset.width,
  //   height: dataset.height,
  //   data: string, // json or base64 string of DataSet array
  //   dataType: string, // name of data array type: TypedArray or Array
  //   type: string, // dataset class name
  // }
  // ```

  // Create JSON string from DataSet, see jsonObject above
  dataSetToJson (dataset, useBase64 = true, meta = {}) {
    const obj = jsonObject(dataset, useBase64, meta)
    return JSON.stringify(obj)
  },

  // Convert the jsonObject string to a basic dataset: width, height, data.
  // The data array will be the same type as the original dataset.
  jsonToDataSet (jsonString) {
    const jsonObj = JSON.parse(jsonString)
    const data = stringToArray(jsonObj.data, jsonObj.dataType)
    return new DataSet(jsonObj.width, jsonObj.height, data)
  },

  // IndexedDB uses the [Structured Clone Algorithm](https://goo.gl/x8H9HK).
  // DataSets can be directly stored and retrieved, they satisfy
  // the SCA requirements.
  toIndexedDB (dataset) {
    return dataset // place holder for IDB sugar if needed
  }
}

export default DataSetIO
