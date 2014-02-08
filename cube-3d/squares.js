function Letters(mapping) {
  var self = this

  this.foreach(function(letter) {
    self[letter] = mapping[letter]
  })
}

Letters.prototype = {
  foreach: function(f) {
    var letters = "_abcdefghijklmnopqrstuvwxyz"

    for (var l = 0; l < letters.length; ++l) {
      f(letters[l], this[letters[l]])
    }
  },
  map: function(f) {
    var self = this

    var result = new Letters({})

    this.foreach(function(letter, value) {
      result[letter] = f(letter, value)
    })

    return result
  }
}

function Choice(face, x, y) {
  this.face = face
  this.x    = new Percent(x)
  this.y    = new Percent(y)
}

Choice.prototype = {
  colour: function() {
    return this.face.colourAt(this.x, this.y).round()
  },
  selection: function() {
    function min(i) {
      return new Percent((i < 0.33) ? 0 : (i < 0.66) ? 0.33 : 0.66)
    }

    function max(i) {
      return new Percent((i > 0.66) ? 1 : (i > 0.33) ? 0.66 : 0.33)
    }

    return this.face
    return this.face.squareAt(
      min(this.x.percent), max(this.x.percent), min(this.y.percent), max(this.y.percent))
  },
  choiceElements: function(listener) {
    var img = this.selection().img(100, function(x, y, rgb) {
      this.x = x
      this.y = y
      listener(rgb)
    })

    return img
  }
}

function Letter(letter, initial, choices) {
  this.letter  = letter
  this.initial = initial
  this.choices = choices || []
}

Letter.prototype = {
  add: function(choice) {
    return new Letter(this.letter, this.initial, this.choices.concat([choice]))
  },
  rgb: function(index) {
    return this.choices[index || this.choices.length - 1].colour()
  },
  choiceElements: function(listener) {
    // console.group('Letter.' + this.letter)

    var tr = document.createElement('tr')
    var td = document.createElement('td')
    td.appendChild(document.createTextNode(this.letter))
    tr.appendChild(td)
    td = document.createElement('td')

    this.choices.foreach(function(choice) {
      td.appendChild(choice.choiceElements(function(rgb) {
        listener(rgb)
        // dd.appendChild(new ColourSquare(rgb, rgb, rgb, rgb).img(10))
      }))

      tr.appendChild(td)
    })

    function createLetterSpan(self, solid) {
      function createSpan(letter) {
        var result = document.createElement('span')
        result.setAttribute('class', letter)
        result.setAttribute('solid', solid)
        result.appendChild(document.createTextNode(letter))
        return result
      }

      var text = ''
      var span = document.createElement('span')

      new Letters({}).foreach(function(letter) {
        span.appendChild(document.createTextNode(' '))
        if (self.letter == letter) {
          span.appendChild(document.createTextNode('\u00A0'))
        } else {
          span.appendChild(createSpan(self.letter))
          span.appendChild(createSpan(letter))
        }
        //text = text + ' ' + self.letter + letter
      })

      return span
    }

    td = document.createElement('td')
    var def = document.createElement('span')
    def.setAttribute('class', 'def-' + this.letter)
    td.appendChild(def)
    td.appendChild(document.createElement('br'))
    td.appendChild(createLetterSpan(this, false))
    td.appendChild(document.createElement('br'))
    td.appendChild(createLetterSpan(this, true))

    tr.appendChild(td)

    // console.groupEnd()
    return tr
  }
}

function LetterCube() {
  var _ = RGB.white, b = RGB.blue,    f = RGB.green,  h = RGB.cyan
  var r = RGB.red,   t = RGB.magenta, x = RGB.yellow, z = RGB.black

  var cube = new ColourCube(
    new ColourSquare(f, h, _, b),
    new ColourSquare(z, x, t, r)
  )

  var rgb = new ColourCube(
    new ColourSquare(f, h, z, b),
    new ColourSquare(_, x, t, r)
  )

  var interpolations = {
    front:  {
      _: [0.0, 0.0], a: [0.5, 0.0], b: [1.0, 0.0],
      c: [0.0, 0.5], d: [0.5, 0.5], e: [1.0, 0.5],
      f: [0.0, 1.0], g: [0.5, 1.0], h: [1.0, 1.0]
    },
    back:   {
      t: [0.0, 0.0], s: [0.5, 0.0], r: [1.0, 0.0],
      w: [0.0, 0.5], v: [0.5, 0.5], u: [1.0, 0.5],
      z: [0.0, 1.0], y: [0.5, 1.0], x: [1.0, 1.0]
    },
    left:   {
      r: [0.0, 0.0], i: [0.5, 0.0], _: [1.0, 0.0],
      u: [0.0, 0.5], l: [0.5, 0.5], c: [1.0, 0.5],
      x: [0.0, 1.0], o: [0.5, 1.0], f: [1.0, 1.0]
    },
    right:  {
      b: [0.0, 0.0], k: [0.5, 0.0], t: [1.0, 0.0],
      e: [0.0, 0.5], n: [0.5, 0.5], w: [1.0, 0.5],
      h: [0.0, 1.0], q: [0.5, 1.0], z: [1.0, 1.0]
    },
    top:    {
      f: [0.0, 0.0], g: [0.5, 0.33], h: [1.0, 0.0],
      o: [0.0, 0.5], p: [0.5, 0.5],  q: [1.0, 0.5],
      x: [0.0, 1.0], y: [0.5, 1.0],  z: [1.0, 1.0]
    },
    bottom: {
      b: [0.0, 0.0], a: [0.5, 0.0], _: [1.0, 0.0],
      k: [0.0, 0.5], j: [0.5, 0.5], i: [1.0, 0.5],
      t: [0.0, 1.0], s: [0.5, 1.0], r: [1.0, 1.0]
    }
  }

  var initial = {
    _: RGB.fromHex('#ffffff'),
    a: RGB.fromHex('#ceceff'),
    b: RGB.fromHex('#0000ff'),
    c: RGB.fromHex('#b4ffb4'),
    d: RGB.fromHex('#40bfbf'),
    e: RGB.fromHex('#0080ff'),
    f: RGB.fromHex('#00ff00'),
    g: RGB.fromHex('#2ad555'),
    h: RGB.fromHex('#00ffff'),
    i: RGB.fromHex('#ffc9c9'),
    j: RGB.fromHex('#bf40bf'),
    k: RGB.fromHex('#8000ff'),
    l: RGB.fromHex('#bfbf40'),
    m: RGB.fromHex('#808080'),
    n: RGB.fromHex('#512899'),
    o: RGB.fromHex('#e3ff00'),
    p: RGB.fromHex('#40bf40'),
    q: RGB.fromHex('#008080'),
    r: RGB.fromHex('#ff0000'),
    s: RGB.fromHex('#e51e5c'),
    t: RGB.fromHex('#ff00ff'),
    u: RGB.fromHex('#ff8000'),
    v: RGB.fromHex('#bf4040'),
    w: RGB.fromHex('#800080'),
    x: RGB.fromHex('#ffff00'),
    y: RGB.fromHex('#808000'),
    z: RGB.fromHex('#000000')
  }


  var alphabet = new Letters({
    m: new Letter('m', initial['m'], [new Choice(new ColourSquare(RGB.white, RGB.black, RGB.white, RGB.black), 0.5, 0)])
  })

  cube.foreachFace(function(face) {
    var interpolationsForFace = interpolations[face.name]

    alphabet.foreach(function(letter) {
      var percentages = interpolationsForFace[letter]

      if (percentages !== undefined) {
        alphabet[letter] = (alphabet[letter] || new Letter(letter, initial[letter]))
          .add(new Choice(face, percentages[0], percentages[1]))
      }
    })
  })

  this.cube = cube
  this.alphabet = alphabet
  this.dataURL = cube.dataURL
}

LetterCube.prototype = {
  toHex: function() {
    return this.alphabet.map(function(_, letter) {
      return letter.rgb().round().toHex()
    })
  },
  choiceElements: function(listener) {
    var table = document.createElement('table')

    this.alphabet.foreach(function(letter, value) {
      table.appendChild(value.choiceElements(function(rgb) {
        listener(letter, rgb)
      }))
    })

    var text = "var initial = {\n"

    this.alphabet.foreach(function(letter, value) {
      text = text + "  " + letter + ": RGB.fromHex('" + value.initial.toHex() + "'),\n"
    })

    text = text + "}"
    var pre = document.createElement('pre')
    pre.appendChild(document.createTextNode(text))

    return new Array(table, pre)
  },
  initial: function(listener) {
    return this.alphabet.map(function(letter, value) {
      // console.log(letter, value)
      if (listener !== undefined) {
        listener(letter, value.initial)
      }

      return value.initial.toHex()
    })
  }
}

function ColourCube(front, back) {
  this.front  = front.named('front')
  this.back   = back.named('back')
  this.bottom = new ColourSquare(back.leftBottom,  back.rightBottom,  front.rightBottom,  front.leftBottom,  'bottom')
  this.left   = new ColourSquare(back.rightTop,    front.leftTop,     back.rightBottom,   front.leftBottom,  'left'  )
  this.right  = new ColourSquare(front.rightTop,   back.leftTop,      front.rightBottom,  back.leftBottom,   'right' )
  this.top    = new ColourSquare(back.rightTop,    back.leftTop,      front.leftTop,      front.rightTop,    'top'   )
}

ColourCube.prototype = {
  describe: function() {
    return this.map(function(side) { return side.describe() })
  },
  round: function() {
    return this.map(function(side) { return side.round() })
  },
  cubeAt: function(x, y, z) {
    function start(ternary) { return ternary * 0.33       }
    function end(ternary)   { return (ternary + 1) * 0.33 }

    var frontSquare = front.squareAt(start(x), end(x), start(y), end(y))
    var backSquare  = back.squareAt(1 - start(x), 1 - end(x), start(y), end(y)).xMirror()

    return new ColourCube(
      frontSquare.interpolate(backSquare, start(z)),
      frontSquare.interpolate(backSquare, end(z)).xMirror()
    )
  },
  foreachFace: function(f) {
    f(this.front); f(this.back); f(this.left); f(this.right); f(this.top); f(this.bottom)
  },
  drawUnfolded: function(element, size) {
    // console.group('drawUnfolded')

    var squares = [this.front, this.right, this.back, this.left]

    function append(face) {
      element.appendChild(face.img(size, function(x, y, rgb) {
        element.appendChild(new ColourSquare(rgb, rgb, rgb, rgb).img(10))
      }))
    }

    append(this.top)
    element.appendChild(document.createElement("br"))

    for (var i = 0; i < squares.length; i++) {
      append(squares[i])
    }

    element.appendChild(document.createElement("br"))
    append(this.bottom.rotate(2))

    // console.groupEnd('drawUnfolded')
  },
  shuffle: function() {
    var colours = this.corners().shuffle()

    return new ColourCube(
      new ColourSquare(colours[0], colours[1], colours[2], colours[3]),
      new ColourSquare(colours[4], colours[5], colours[6], colours[7])
    )
  },
  corners: function() {
    return this.front.corners().concat(this.back.corners())
  },
  map: function(f) {
    return new ColourCube(f(this.front), f(this.back))
  }
}

ColourCube.random = function() {
  return new ColourCube(ColourSquare.random(), ColourSquare.random())
}

function ColourCanvas(size, square, create) {
  this.size   = size
  this.square = square

  if ((create === undefined) || create) {
    var canvas = document.createElement('canvas')
    canvas.width          = size
    canvas.height         = size
    canvas.style.zIndex   = 8
    canvas.style.position = "relative"
    canvas.style.border   = "1px solid"

    var context = canvas.getContext("2d")
    var data    = context.getImageData(0, 0, size, size)

    for (var y = 0; y < size; ++y) {
      for (var x = 0; x < size; ++x) {
        var interpolated = square.colourAt(new Percent(x / (size - 1)), new Percent(y / (size - 1)))
        var index        = (x + ((size - 1) - y) * size) * 4

        interpolated.addTo(data, index)
      }
    }

    context.putImageData(data, 0, 0)

    this.xOffset = document.body.scrollLeft + document.documentElement.scrollLeft
    this.yOffset = document.body.scrollTop  + document.documentElement.scrollTop

    addAddListener(canvas, this)
    this.canvas  = canvas
  }
}

ColourCanvas.prototype = {
  colourAt: function(x, y) {
    // console.log("colourAt", x, y)
    if (x < 0 || x > this.size || y < 0 || y > this.size) {
      throw "Invalid parameters to colourAt: " + [x, y] + ", size = " + this.size
    }

    return this.square.colourAt(this.xPercent(x), this.yPercent(y))
  },
  xPercent: function(x) {
    return new Percent(x / (this.size - 1))
  },
  yPercent: function(y) {
    return new Percent(((this.size - 1) - y) / (this.size - 1))
  },
  img: function(listener) {
    // console.log('ColourCanvas.img', this.size, this.square, listener)
    var img = document.createElement('img')

    img.setAttribute('src', this.dataURL())
    img.setAttribute('style', "border: 1px solid")

    var result = addAddListener(img, this)

    if (listener !== undefined) {
      result.addListener(listener)
    }

    return result
  },
  dataURL: function() {
    return this.canvas.toDataURL('image/png')
  }
}

function addAddListener(element, canvas) {
  element.addListener = function(listener) {
    var capture = false

    element.addEventListener('click', function(event) {
      capture = !capture
      var x = event.offsetX, y = event.offsetY

      listener(x, y, canvas.colourAt(x, y).round())
    })

    element.addEventListener('mousemove', function(event) {
      if (capture) {
        var x = event.offsetX, y = event.offsetY

        listener(x, y, canvas.colourAt(x, y).round())
      }
    })
  }

  return element
}


function ColourSquare(leftTop, rightTop, leftBottom, rightBottom, name) {
  this.leftTop = leftTop
  this.rightTop = rightTop
  this.leftBottom = leftBottom
  this.rightBottom = rightBottom
  this.name = name || '<unnamed>'
}

ColourSquare.prototype = {
  describe: function() {
    return this.map(function (corner) { return corner.describe() })
  },
  left: function()   { return [this.leftTop,    this.leftBottom]  },
  right: function()  { return [this.rightTop,   this.rightBottom] },
  top: function()    { return [this.leftTop,    this.rightTop]    },
  bottom: function() { return [this.leftBottom, this.rightBottom] },
  corners: function() { return this.top().concat(this.bottom()) },
  named: function(name) {
    return new ColourSquare(this.leftTop, this.rightTop, this.leftBottom, this.rightBottom, name)
  },
  round: function() {
    return this.map(function (corner) { return corner.round() })
  },
  squareAt: function(xStart, xEnd, yStart, yEnd) {
    if (xStart < 0 || xStart > 1.0 || xEnd < 0 || xEnd > 1.0 ||
        yStart < 0 || yStart > 1.0 || yEnd < 0 || yEnd > 1.0) {

      throw "squareAt(" + [xStart, xEnd, yStart, yEnd].join(", ") + ") is invalid"
    }

    return new ColourSquare(
      this.colourAt(xStart, yStart), this.colourAt(xEnd, yStart),
      this.colourAt(xStart, yEnd),   this.colourAt(xEnd, yEnd)
    )
  },
  rotate: function(amount) {
    var mod = (amount + 4) % 4

    if (mod === 0) {
      return this
    } else {
      return new ColourSquare(
        this.leftBottom, this.leftTop, this.rightBottom, this.rightTop
      ).rotate(mod - 1)
    }
  },
  xMirror: function() {
    return new ColourSquare(this.rightTop, this.leftTop, this.rightBottom, this.leftBottom)
  },
  interpolate: function(other, percentage) {
    return this.zipWith(other, function(from, to) { from.interpolate(to, percentage) })
  },
  colourAt: function(xPercent, yPercent) {
    var left  = this.leftBottom.interpolate(this.leftTop, yPercent)
    var right = this.rightBottom.interpolate(this.rightTop, yPercent)

    return left.interpolate(right, xPercent)
  },
  img: function(size, listener) {
    return this.createCanvas(size).img(listener)
  },
  dataURL: function(size) {
    return this.createCanvas(size).dataURL()
  },
  createCanvas: function(size) {
    return new ColourCanvas(size, this)
  },
  map: function(f) {
    return new ColourSquare(
      f(this.leftTop), f(this.rightTop), f(this.leftBottom), f(this.rightBottom))
  },
  zipWith: function(other, f) {
    return new ColourSquare(
      f(this.leftTop, other.leftTop), f(this.rightTop, other.rightTop),
      f(this.leftBottom, other.leftBottom), f(this.rightBottom, other.rightBottom)
    )
  }
}

ColourSquare.random = function() {
  return new ColourSquare(RGB.random(), RGB.random(), RGB.random(), RGB.random())
}

Number.prototype.roundTo = function(dp) {
  var mult = Math.pow(10, dp || 0)

  return Math.round(this * mult) / mult
}

Number.prototype.toHex = function() {
  var result = this.toString(16)

  if (result.length < 2) result = '0' + result

  return result
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.foreach = function(f) {
  for (var i = 0; i < this.length; ++i) {
    f(this[i])
  }
}

function Percent(percent) {
  if (percent instanceof Percent) {
    this.percent = percent.percent
  } else {
    this.percent = percent
  }

  if (percent < 0 || percent > 1.0) {
    throw "Invalid Percent: " + percent
  }
}

Percent.prototype = {
  interpolate: function(from, to) {
    return (from * (1 - this.percent)) + (this.percent * to)
  }
}

Percent.one  = new Percent(1)
Percent.zero = new Percent(0)

/*
Array.prototype.shuffle = function() {
  var o = this

  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

  return o;
}*/

function RGB(red, green, blue) {
  this.red = red; this.green = green; this.blue = blue;

  if (red < 0 || red > 256 || green < 0 || green > 256 || blue < 0 || blue > 256) {
    throw "Invalid RGB: " + [red, green, blue]
  }
}

RGB.prototype = {
  describe: function() {
    return "RGB(" + this.red + ", " + this.green + ", " + this.blue + ")"
  },
  round: function(dp) {
    return this.map(function(n) { return n.roundTo(dp) })
  },
  toHex: function() {
    var hex = this.map(function(n) { return n.toHex() })

    return "#" + hex.red + hex.green + hex.blue
  },
  interpolate: function(other, percentage, conversion) {
    // return this.toCIELch().interpolate(other.toCIELch(), percentage).toRGB()
    return this.zipWith(other, function(from, to) {
      return percentage.interpolate(from, to)
    })
  },
  addTo: function(data, index) {
    data.data[index + 0] = this.red
    data.data[index + 1] = this.green
    data.data[index + 2] = this.blue
    data.data[index + 3] = 255
  },
  toCIELch: function() {
    return this.toXYZ().toCIELab().toCIELch()
  },
  toXYZ: function() {
    function calc(i) {
      return (i > 0.04045) ? (Math.pow(((i + 0.055) / 1.055), 2.4)) : (i / 12.92)
    }

    var tmp_r = calc(this.red   / 255) * 100
    var tmp_g = calc(this.green / 255) * 100
    var tmp_b = calc(this.blue  / 255) * 100

    var x = tmp_r * 0.4124 + tmp_g * 0.3576 + tmp_b * 0.1805;
    var y = tmp_r * 0.2126 + tmp_g * 0.7152 + tmp_b * 0.0722;
    var z = tmp_r * 0.0193 + tmp_g * 0.1192 + tmp_b * 0.9505;

    return new XYZ(x, y, z)
  },
  map: function(f) {
    return new RGB(f(this.red), f(this.green), f(this.blue))
  },
  zipWith: function(other, f) {
    return new RGB(
      f(this.red, other.red), f(this.green, other.green), f(this.blue, other.blue))
  }
}

RGB.fromHex = function(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return new RGB(
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  )
}

RGB.white   = new RGB(255, 255, 255)
RGB.black   = new RGB(  0,   0,   0)

RGB.red     = new RGB(255,   0,   0)
RGB.green   = new RGB(  0, 255,   0)
RGB.blue    = new RGB(  0,   0, 255)

RGB.cyan    = new RGB(  0, 255, 255)
RGB.magenta = new RGB(255,   0, 255)
RGB.yellow  = new RGB(255, 255,   0)
RGB.red     = new RGB(255,   0,   0)

RGB.random = function(dp) {
  function rnd() { return Math.random() * 256 }

  var result = new RGB(rnd(), rnd(), rnd())

  if (typeof(dp) != 'undefined') {
    result = result.round(dp)
  }

  return result
}

function XYZ(x, y, z) {
  this.x = x
  this.y = y
  this.z = z
}

XYZ.prototype = {
  toCIELab: function() {
    function calc(i) {
      return (i > 0.008856) ? Math.pow(i, 1 / 3) : ((7.787 * i) + (16 / 116))
    }

    var x = calc(this.x /  95.047)
    var y = calc(this.y / 100.000)
    var z = calc(this.z / 108.883)

    var l = (y > 0.008856) ? ((116 * y) - 16) : (903.3 * y)
    var a = 500 * (x - y);
    var b = 200 * (y - z);

    return new CIELab(l, a, b)
  },
  toRGB: function() {
    var var_X = this.x / 100;
    var var_Y = this.y / 100;
    var var_Z = this.z / 100;

    function calc(i) {
      return (i > 0.0031308) ? (1.055 * Math.pow(i, (1 / 2.4)) - 0.055) : (12.92 * i)
    }

    var var_R = calc(var_X *  3.2406 + var_Y * -1.5372 + var_Z * -0.4986)
    var var_G = calc(var_X * -0.9689 + var_Y *  1.8758 + var_Z *  0.0415)
    var var_B = calc(var_X *  0.0557 + var_Y * -0.2040 + var_Z *  1.0570)

    function bound(v,l,h) {
      return Math.min(h, Math.max(l, v));
    }

    return new RGB(
      bound((var_R * 255), 0, 255),
      bound((var_G * 255), 0, 255),
      bound((var_B * 255), 0, 255)
    )
  }
}

function CIELab(l, a, b) {
  this.l = l
  this.a = a
  this.b = b
}

CIELab.prototype = {
  toCIELch: function() {
    var var_H = Math.atan2(this.b, this.a);

    if (var_H > 0) {
      var_H = (var_H / Math.PI) * 180;
    } else {
      var_H = 360 - (Math.abs(var_H) / Math.PI) * 180
    }

    return new CIELch(
      this.l,
      Math.sqrt(Math.pow(this.a, 2) + Math.pow(this.b, 2)),
      var_H
      //var_H < 360 ? var_H : (var_H - 360)
    )
  },
  toXYZ: function() {
    var ref_X = 95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;

    function calc(i) {
      return (Math.pow(i, 3) > 0.008856) ? Math.pow(i, 3) : ((i - 16 / 116) / 7.787)
    }

    var var_Y = (this.l + 16) / 116
    var var_X = this.a / 500 + var_Y
    var var_Z = var_Y - this.b / 200

    var_X = calc(var_X)
    var_Y = calc(var_Y)
    var_Z = calc(var_Z)

    return new XYZ(ref_X * var_X, ref_Y * var_Y, ref_Z * var_Z)
  }
}

function CIELch(l, c, h) {
  this.l = l
  this.c = c
  this.h = h
}

CIELch.prototype = {
  toCIELab: function() {
    var l = this.l;
    var hradi = this.h * (Math.PI / 180);
    var a = Math.cos(hradi) * this.c;
    var b = Math.sin(hradi) * this.c;

    return new CIELab(l, a, b)
  },
  toRGB: function() {
    return this.toCIELab().toXYZ().toRGB()
  },
  interpolate: function(other, percentage) {
    fromColor = this
    toColor = other
    steps = 5;

    numSteps = steps;

    var toH = toColor.h
    var fromH = fromColor.h
    var diff = toH - fromH;

    if (Math.abs(diff) > 180) {
      if (diff > 0) {
        fromH += 360;
      }
      else {
        toH += 360;
      }
    }

    var l = fromColor.l + (toColor.l - fromColor.l) * percentage
    var c = fromColor.c + (toColor.c - fromColor.c) * percentage
    var h = fromH       + (toH       - fromH      ) * percentage

    return new CIELch(l, c, h)
  }
}

function Options() { }

Options.prototype = {
  isSolid: function(action) {
    chrome.storage.sync.get('solid', function(value) {
      action(value.solid)
    })
  },
  setSolid: function(value, callback) {
    chrome.storage.sync.set({'solid': value}, callback)
  }
}

if (typeof module != 'undefined' && module.exports) module.exports.squares = {
  RGB: RGB,
  Percent: Percent,
  ColourSquare: ColourSquare,
  ColourCanvas: ColourCanvas,
  ColourCube:   ColourCube,
  Letter:       Letter,
  Letters:      Letters,
  Choice:       Choice,
  LetterCube:   LetterCube
}
