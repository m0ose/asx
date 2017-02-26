import SpriteSheet from 'lib/SpriteSheet.js'
import util from 'lib/util.js'

document.body.style.backgroundColor = 'lightgrey'
const ss = new SpriteSheet(64, 16)
const paths = SpriteSheet.getPaths()

const modules = { SpriteSheet, util, ss, paths }
util.toWindow(modules)
console.log(Object.keys(modules).join(', '))

document.body.appendChild(ss.ctx.canvas)

const colors = 'white silver gray black red maroon yellow olive lime green cyan teal blue navy magenta purple'.split(' ')
function color2 (i) { return i === 0 ? colors[colors.length - 1] : colors[i - 1] }
util.toWindow({colors, color2})

colors.forEach((color, i) => ss.addSprite(
  ss.drawImage('arrow', color, color2(i))
))
colors.forEach((color, i) => ss.addSprite(
  ss.drawImage('circle', color, color2(i))
))
colors.forEach((color, i) => ss.addSprite(
  ss.drawImage('dart', color, color2(i))
))
colors.forEach((color, i) => ss.addSprite(
  ss.drawImage('ring', color, color2(i))
))
colors.forEach((color, i) => ss.addSprite(
  ss.drawImage('ring2', color, color2(i))
))
colors.forEach((color, i) => ss.addSprite(
  ss.drawImage('square', color, color2(i))
))
colors.forEach((color, i) => ss.addSprite(
  ss.drawImage('triangle', color, color2(i))
))
colors.forEach((color, i) => ss.addSprite(
  ss.drawImage('square2', color, color2(i))
))
// (ctx) => { paths.circle(ctx) }, color, color2(i)
// drawImage (drawFcn, fillColor, strokeColor = 'black', useHelpers = true) {

util.imagePromise('test/data/redfish.png').then((img) => {
  console.log(img, img.height, img.width)
  // const ss = new SpriteSheet()
  const sprites = util.repeat(16, (i, a) => { a[i] = ss.addSprite(img) })
  util.toWindow({ss, img, sprites})
  // const sprites = util.repeat(65, (i, a) => a[i] = ss.addSprite(img))
  // repeat (n, f, a = []) { for (let i = 0; i < n; i++) f(i, a); return a },
})
