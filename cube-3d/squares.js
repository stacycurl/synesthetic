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
      f(letters[l])
    }
  },
  map: function(f) {
    var self = this

    var result = new Letters({})

    this.foreach(function(letter) {
      result[letter] = f(self[letter])
    })

    return result
  }
}

function Choice(face, x, y) {
  this.face = face
  this.x    = x
  this.y    = y
}

Choice.prototype = {
  colour: function() {
    return this.face.colourAt(this.x, this.y)
  }
}

function Letter(letter, choices) {
  this.letter  = letter
  this.choices = choices
}

Letter.prototype = {
  add: function(square) {
    return new Letter(this.letter, this.choices)
  },
  rgb: function() {
    return this.choices[0].colour()
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
    bottom: { // ba_ kji tsr
      b: [0.0, 0.0], a: [0.5, 0.0], _: [1.0, 0.0],
      k: [0.0, 0.5], j: [0.5, 0.5], i: [1.0, 0.5],
      t: [0.0, 1.0], s: [0.5, 1.0], r: [1.0, 1.0]
    }
  }

  var grey = RGB.white.interpolate(RGB.black, 0.5).square()

  var alphabet = new Letters({
    m: new Letter('m', [new Choice(grey, 0, 0)])
  })

  cube.foreachFace(function(face) {
    var interpolationsForFace = interpolations[face.name]

    alphabet.foreach(function(letter) {
      var percentages = interpolationsForFace[letter] 

      if (percentages != undefined) {
        var x = percentages[0], y = percentages[1]
        alphabet[letter] = new Letter(letter, [new Choice(face, x, y)])
      }
    })
  })

  this.cube = cube
  this.alphabet = alphabet
  this.dataURL = cube.dataURL
}

LetterCube.prototype = {
  toHex: function() {
    return this.alphabet.map(function(letter) {
      return letter.rgb().round().toHex()
    })
  }
}

function ColourCube(front, back) {
  this._type = "ColourCube",
  this.front = front.named('front')
  this.back = back.named('back')
  this.bottom = new ColourSquare(
    back.leftBottom, back.rightBottom, front.rightBottom,  front.leftBottom, 'bottom'
  )
  this.left = new ColourSquare(
    back.rightTop, front.leftTop, back.rightBottom, front.leftBottom, 'left'
  )
  this.right = new ColourSquare(
    front.rightTop,back.leftTop, front.rightBottom, back.leftBottom, 'right'
  )
  this.top = new ColourSquare(back.rightTop, back.leftTop, front.leftTop, front.rightTop, 'top'
  )
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
    var squares = [this.front, this.right, this.back, this.left]
    function append(face) {
      var img = face.img(size)

      img.addListener(function(rgb) {
        element.appendChild(new ColourSquare(rgb, rgb, rgb, rgb).img(10))
      })

      element.appendChild(img)
    }

    append(this.top)
    element.appendChild(document.createElement("br"))

    for (var i = 0; i < squares.length; i++) {
      append(squares[i])
    }

    element.appendChild(document.createElement("br"))
    append(this.bottom.rotate(2))
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

  if ((create == undefined) || create) {
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
        var interpolated = square.colourAt(x / (size - 1), y / (size - 1))
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
    return this.square.colourAt(this.xPercent(x), this.yPercent(y))
  },
  xPercent: function(x) {
    return x / (this.size - 1)
  },
  yPercent: function(y) {
    return ((this.size - 1) - y) / (this.size - 1)
  },
  img: function() {
    var img = document.createElement('img')

    img.setAttribute('src', this.dataURL())
    img.setAttribute('style', "border: 1px solid")
    
    return addAddListener(img, this)
  },
  dataURL: function() {
    return this.canvas.toDataURL('image/png')
  }
}

function addAddListener(element, canvas) {
  function getX(event) {
    return (event.pageX || (event.clientX + canvas.xOffset)) - element.offsetLeft
  }

  function getY(event) {
    return (event.pageY || (event.clientY + canvas.yOffset)) - element.offsetTop
  }

  element.addListener = function(listener) {
    element.addEventListener('click', function(event) {
      listener(canvas.colourAt(getX(event), getY(event)))
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
    return new ColourSquare(
      this.colourAt(xStart, yStart), this.colourAt(xEnd, yStart),
      this.colourAt(xStart, yEnd),   this.colourAt(xEnd, yEnd)
    ) 
  },
  rotate: function(amount) {
    var mod = (amount + 4) % 4

    if (mod == 0) {
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
  img: function(size) {
    return this.createCanvas(size).img()
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

/*
Array.prototype.shuffle = function() {
  var o = this

  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

  return o;
}*/

function RGB(red, green, blue) {
  this.red = red; this.green = green; this.blue = blue;
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
      return (from * (1 - percentage)) + (percentage * to)
    })
  },
  square: function() {
    return new ColourSquare(this, this, this, this)
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
    var tmp_r = this.red / 255;
    var tmp_g = this.green / 255;
    var tmp_b = this.blue / 255;

    if (tmp_r > 0.04045) {
      tmp_r = Math.pow(((tmp_r + 0.055) / 1.055), 2.4);
    } else {
      tmp_r = tmp_r / 12.92;
    }

    if (tmp_g > 0.04045) {
      tmp_g = Math.pow(((tmp_g + 0.055) / 1.055), 2.4);
    } else {
      tmp_g = tmp_g / 12.92;
    }

    if (tmp_b > 0.04045) {
      tmp_b = Math.pow(((tmp_b + 0.055) / 1.055), 2.4);
    } else {
      tmp_b = tmp_b / 12.92;
    }

    tmp_r = tmp_r * 100;
    tmp_g = tmp_g * 100;
    tmp_b = tmp_b * 100;

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

RGB.white   = new RGB(255, 255, 255),
RGB.black   = new RGB(  0,   0,   0),

RGB.red     = new RGB(255,   0,   0),
RGB.green   = new RGB(  0, 255,   0),
RGB.blue    = new RGB(  0,   0, 255),

RGB.cyan    = new RGB(  0, 255, 255),
RGB.magenta = new RGB(255,   0, 255),
RGB.yellow  = new RGB(255, 255,   0),
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
    var Xn = 95.047;
    var Yn = 100.000;
    var Zn = 108.883;

    var x = this.x / Xn;
    var y = this.y / Yn;
    var z = this.z / Zn;

    if (x > 0.008856) {
      x = Math.pow(x, 1 / 3);
    } else {
      x = (7.787 * x) + (16 / 116);
    }

    if (y > 0.008856) {
      y = Math.pow(y, 1 / 3);
    } else {
      y = (7.787 * y) + (16 / 116);
    }

    if (z > 0.008856) {
      z = Math.pow(z, 1 / 3);
    } else {
      z = (7.787 * z) + (16 / 116);
    }

    if (y > 0.008856) {
      var l = (116 * y) - 16;
    } else {
      var l = 903.3 * y;
    }

    var a = 500 * (x - y);
    var b = 200 * (y - z);

    return new CIELab(l, a, b)
  },
  toRGB: function() {
    var var_X = this.x / 100;
    var var_Y = this.y / 100;
    var var_Z = this.z / 100;

    var var_R = var_X * 3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
    var var_G = var_X * -0.9689 + var_Y * 1.8758 + var_Z * 0.0415;
    var var_B = var_X * 0.0557 + var_Y * -0.2040 + var_Z * 1.0570;

    if (var_R > 0.0031308) {
      var_R = 1.055 * Math.pow(var_R, (1 / 2.4)) - 0.055;
    } else {
      var_R = 12.92 * var_R;
    }
    if (var_G > 0.0031308) {
      var_G = 1.055 * Math.pow(var_G, (1 / 2.4)) - 0.055;
    } else {
      var_G = 12.92 * var_G;
    }
    if (var_B > 0.0031308) {
      var_B = 1.055 * Math.pow(var_B, (1 / 2.4)) - 0.055;
    } else {
      var_B = 12.92 * var_B;
     }

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

    var var_Y = (this.l + 16) / 116;
    var var_X = this.a / 500 + var_Y;
    var var_Z = var_Y - this.b / 200;

    if (Math.pow(var_Y, 3) > 0.008856) {
      var_Y = Math.pow(var_Y, 3);
    } else {
      var_Y = (var_Y - 16 / 116) / 7.787;
    }

    if (Math.pow(var_X, 3) > 0.008856) {
      var_X = Math.pow(var_X, 3);
    } else {
      var_X = (var_X - 16 / 116) / 7.787;
    }

    if (Math.pow(var_Z, 3) > 0.008856) {
      var_Z = Math.pow(var_Z, 3);
    } else {
      var_Z = (var_Z - 16 / 116) / 7.787;
    }

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
    var h = fromH + (toH - fromH) * percentage

    return new CIELch(l, c, h)
  }
}

if (typeof module != 'undefined' && module.exports) module.exports.squares = {
  RGB: RGB,
  ColourSquare: ColourSquare,
  ColourCanvas: ColourCanvas,
  ColourCube:   ColourCube,
  Letter:       Letter,
  LetterCube:   LetterCube
}
