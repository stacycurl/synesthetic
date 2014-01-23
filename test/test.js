var assert = require('assert')
var squares = require('./../cube-3d/squares').squares

var RGB          = squares.RGB
var ColourSquare = squares.ColourSquare
var ColourCanvas = squares.ColourCanvas
var ColourCube   = squares.ColourCube
var LetterCube   = squares.LetterCube

describe('RGB', function() {
  describe('#describe', function() {
    it('should include all 3 components', function() {
      assert.equal('RGB(255, 255, 255)', new RGB(255, 255, 255).describe())
    })
  })

  describe('#toHex', function() {
    it('should work with base colours', function() {
      assert.equal('#000000', RGB.black.toHex(), 'black')
      assert.equal('#ffffff', RGB.white.toHex(), 'white')

      assert.equal('#ff0000', RGB.red.toHex(),   'red')
      assert.equal('#0000ff', RGB.blue.toHex(),  'blue')
      assert.equal('#00ff00', RGB.green.toHex(), 'green')

      assert.equal('#00ffff', RGB.cyan.toHex(),    'cyan')
      assert.equal('#ff00ff', RGB.magenta.toHex(), 'magenta')
      assert.equal('#ffff00', RGB.yellow.toHex(),  'yellow')
    })
  })

  describe('#round', function() {
    it('should round each component to 0dp by default', function() {
      assert.deepEqual(new RGB(2, 2, 3), new RGB(1.5, 2.2, 3.4).round())
    })

    it('should round to arg-dp otherwise', function() {
      assert.deepEqual(new RGB(2.2, 3.4, 4.5), new RGB(2.18, 3.41, 4.46).round(1))
    })
  })

  describe('#interpolate', function() {
    it('should equal the lhs when percentage = 0', function() {
      for (var repetitions = 0; repetitions < 10; ++repetitions) {
        var left = RGB.random(2), right = RGB.random(2)

        assert.deepEqual(left, left.interpolate(right, 0).round(2))
      }
    })

    it('should linerly interpolate between each component separately', function() {
      assert.deepEqual(new RGB(128, 128, 128),
        RGB.white.interpolate(RGB.black, 0.5).round())
    })
  })
})

describe('ColourSquare', function() {
  var s = new ColourSquare(RGB.green, RGB.cyan, RGB.white, RGB.blue)    

  describe('describe', function() {
    it('should include 4 corners', function() {
      
      assert.deepEqual(s.describe(), {
        leftTop:     RGB.green.describe(),
        rightTop:    RGB.cyan.describe(),
        leftBottom:  RGB.white.describe(),
        rightBottom: RGB.blue.describe(),
        name: '<unnamed>'
      })
    })
  })

  it('#left should return left corners', function() {
    assert.deepEqual(s.left(), [s.leftTop, s.leftBottom])
  })

  it('#right should return right corners', function() {
    assert.deepEqual(s.right(), [s.rightTop, s.rightBottom])
  })

  it('#top should return top corners', function() {
    assert.deepEqual(s.top(), [s.leftTop, s.rightTop])
  })

  it('#bottom should return bottom corners', function() {
    assert.deepEqual(s.bottom(), [s.leftBottom, s.rightBottom])
  })

  it('colourAt should return colour from left bottom corner', function() {
    assert.deepEqual(s.colourAt(0, 0), s.leftBottom)
    assert.deepEqual(s.colourAt(0, 1), s.leftTop)
    assert.deepEqual(s.colourAt(1, 1), s.rightTop)
    assert.deepEqual(s.colourAt(1, 0), s.rightBottom)
  })

  it('createCanvas should return ColourCanvas', function() {
  })
})

describe('ColourCanvas', function() {
  it('colourXY should return colour at canvas coords', function() {
    var size   = 100
    var square = ColourSquare.random()
    var canvas = new ColourCanvas(size, square, false)

    assert.deepEqual(canvas.colourAt(0,        0),        square.colourAt(0, 1))
    assert.deepEqual(canvas.colourAt(size - 1, 0),        square.colourAt(1, 1))
    assert.deepEqual(canvas.colourAt(size - 1, size - 1), square.colourAt(1, 0))
    assert.deepEqual(canvas.colourAt(0,        size - 1), square.colourAt(0, 0))
  })
})

describe('ColourCube', function() {
  var front = new ColourSquare("f", "h", "_", "b")
  var back = new ColourSquare("z", "x", "t", "r")
  var cube = new ColourCube(front, back)

  describe('faces', function() {
    it('should make sense', function() {
      assert.deepEqual(cube.front.corners(),  "fh_b".split(""))
      assert.deepEqual(cube.back.corners(),   "zxtr".split(""))
      assert.deepEqual(cube.left.corners(),   "xfr_".split(""))
      assert.deepEqual(cube.right.corners(),  "hzbt".split(""))
      assert.deepEqual(cube.top.corners(),    "xzfh".split(""))
      assert.deepEqual(cube.bottom.corners(), "trb_".split(""))
    })
  })
})

describe('LetterCube', function() {
  var lc = new LetterCube()

  describe('corners', function() {
    it('should match expected colours', function() {
      assert.deepEqual(lc.cube.front.corners(), [RGB.green, RGB.cyan, RGB.white, RGB.blue])
      assert.deepEqual(lc.cube.back.corners(),  [RGB.black, RGB.yellow, RGB.magenta, RGB.red])
    })
  })

  describe('letters', function() {
    it('should match expected colours', function() {
      assert.deepEqual(lc.alphabet._, RGB.white)
      assert.deepEqual(lc.alphabet.r, RGB.red)
      assert.deepEqual(lc.alphabet.f, RGB.green)
      assert.deepEqual(lc.alphabet.b, RGB.blue)
      assert.deepEqual(lc.alphabet.i, RGB.white.interpolate(RGB.red, 0.5))
      assert.deepEqual(lc.alphabet.c, RGB.white.interpolate(RGB.green, 0.5))
      assert.deepEqual(lc.alphabet.a, RGB.white.interpolate(RGB.blue, 0.5))
    })
  })

  describe('#toHex', function() {
    var actual = lc.toHex()

    it('should match expected colours', function() {
      assert.equal(actual._, "#ffffff")
      assert.equal(actual.a, "#8080ff")
      assert.equal(actual.b, "#0000ff")
      assert.equal(actual.c, "#80ff80")
      assert.equal(actual.d, "#40bfbf")
      assert.equal(actual.e, "#0080ff")
      assert.equal(actual.f, "#00ff00")
      assert.equal(actual.g, "#2ad555")
      assert.equal(actual.h, "#00ffff")
      assert.equal(actual.i, "#ff8080")
      assert.equal(actual.j, "#bf40bf")
      assert.equal(actual.k, "#8000ff")
      assert.equal(actual.l, "#bfbf40")
      assert.equal(actual.m, "#808080")
      assert.equal(actual.n, "#4040bf")
      assert.equal(actual.o, "#80ff00")
      assert.equal(actual.p, "#40bf40")
      assert.equal(actual.q, "#008080")
      assert.equal(actual.r, "#ff0000")
      assert.equal(actual.s, "#ff0080")
      assert.equal(actual.t, "#ff00ff")
      assert.equal(actual.u, "#ff8000")
      assert.equal(actual.v, "#bf4040")
      assert.equal(actual.w, "#800080")
      assert.equal(actual.x, "#ffff00")
      assert.equal(actual.y, "#808000")
      assert.equal(actual.z, "#000000")
    })
  })
})
