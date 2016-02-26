import DataSet from 'src/dataset.js'
export default function () {
  let ds = new DataSet(2, 3, [0,1,2,3,4,5])
  console.log(ds)
  let a, b
  [a, b] = [1, 2]
  console.log(a, b)
}
