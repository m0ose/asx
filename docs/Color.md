 # Color.js

A general color module, supporting css string colors, canvas2d pixel colors, webgl and canvas2d Uint8ClampedArray r,g,b,a arrays.

Notice a JavaScript Array [r, g, b, a] is **not** a color!


## Exports

Exports an object with several Color functions, primarily managing a TypedArray color.

## TypedArray Color

The primary use of this module is to create and manage a special color object created using prototypal inheritance methods. It uses two TypedArray views onto the same Buffer: Uint8ClampedArray[4] with r,g,b,a 0-255 values, and Uint32[1] pixel value.

> `color (r, g, b, a = 255)`

Create a Uint8ClampedArray color from r, g, b, a, a defaulted to 255. Add a Uint32Array pixel view the same buffer. Using
`Object.setPrototypeOf(color, ColorProto)`
add several prototypal methods to the returned TypedArray color.

> `isColor (color)`

Returns true if the given color is a TypedArray color .. referred to as a `Color.color`.

> `toColor (any)`

Converts any of the JavaScript colors (css names, hash strings, rgb/hsl strings, webgl float array, JS rgb(a) Array, ...) to a Color.color. If `any` is already a Color.color, simply return it.

> `randomColor ()`

Return a random rgb Color.color, a=255.

## ColorProto

The methods available to a Color.color:

> `color.setColor (r, g, b, a = 255)`

Set the color to new rgba values.

> `setPixel (pixel)`

Set the color to new r,g,b,a values via a 32 bit pixel value.

> `getPixel ()`

Get the pixel value for this color.

> `get pixel ()` <br />
> `set pixel (pixel)`

Getter/setter for the above for property-like access. I.e.

`color.pixel = <int>` or `const pixel = color.pixel`

```
const color = Color.toColor('red')
color.pixel === 0xff0000ff // true (4278190335)
color.pixel = 0x0000ffff // opaque blue? Nope, little endian:
console.log(Array.from(color)) // [255, 255, 0, 0]
```

> `setCss (string)` <br />
> `getCss ()` <br />
> `get css ()` <br />
> `set css (string)`

As with the pixel methods, get/set the color's css string.

The returned css string will *not* be the same as the set string, they are all normalized to a hash string or rgba string if a isn't 255 (#f0f, #f08000, 'rgba(255,255,0,0.5)') Ex:
```
const color = Color.toColor('red')
color.css === "#f00" // true
color.setColor(255, 0, 0, 128)
color.css === "rgba(255,0,0,0.50)" // true
```

> `setWebgl (floatArray)` <br />
> `getWebgl ()` <br />
> `get webgl ()` <br />
> `set webgl (floatArray)`

A similar set of get/set colors using webgl's Float32Array.

One difference: if alpha is 1, the returned array has just three elements. This is the usual webgl usage to minimize buffer transfer to the GPU.

> `equals (color)`

Compare this color with another. The color must be a Color.color. Use the pixel values for comparison.

`Color.toColor('red').equals(Color.color(255,0,0))` // true

> `rgbDistance (r, g, b)`

Return a [distance metric](http://www.compuphase.com/cmetric.htm) between two colors. Max distance is roughly `765**2` or `(3*255)**2 === 585225`, for black & white. (We use the sqDistance, avoiding Math.sqrt())

```
Color.toColor('red').rgbDistance(255,0,0) // 0
Color.toColor('white').rgbDistance(0,0,0) // 584970
```

## Utilities

There are several additional utilities, used by Color.color, see code for details:

> `rgbaString (r, g, b, a = 255)` <br />
> `hslString (h, s, l, a = 255)` <br />
> `hexString (r, g, b, shortOK = true)` <br />
> `hexShortString (r, g, b)` <br />
> `triString (r, g, b, a = 255)` <br />
> `stringToUint8s (string)`

The latter is the most interesting! It converts *any* legal css color string into an r,g,b,a TypedArray.

Because strings vary widely: CadetBlue, #0f0, rgb(255,0,0), hsl(120,100%,50%), we do not parse strings, instead we let the browser do our work: we fill a 1x1 canvas with the css string color, returning the r,g,b,a canvas ImageData TypedArray!

## Code

Code is [here](https://github.com/backspaces/asx/blob/master/src/Color.js).
