var squares = require('./../cube-3d/squares').squares
var expect  = require('chai').use(require('chai-fuzzy')).expect


var RGB          = squares.RGB
var Percent      = squares.Percent
var Choice       = squares.Choice
var Letter       = squares.Letter
var Letters      = squares.Letters
var ColourSquare = squares.ColourSquare
var ColourCanvas = squares.ColourCanvas
var ColourCube   = squares.ColourCube
var LetterCube   = squares.LetterCube


describe('Array', function() {
  describe('#last', function() {
    it('should return the last item of an Array', function() {
      expect([1, 2, 3].last()).to.equal(3)
    })
  })
})

describe('RGB', function() {
  describe('#describe', function() {
    it('should include all 3 components', function() {
      expect(new RGB(255, 255, 255).describe()).to.be.like('RGB(255, 255, 255)')
    })
  })

  describe('#toHex', function() {
    it('should work with base colours', function() {
      expect(RGB.black.toHex()).to.equal('#000000')
      expect(RGB.white.toHex()).to.equal('#ffffff')

      expect(RGB.red.toHex()).to.equal('#ff0000')
      expect(RGB.blue.toHex()).to.equal('#0000ff')
      expect(RGB.green.toHex()).to.equal('#00ff00')

      expect(RGB.cyan.toHex()).to.equal('#00ffff')
      expect(RGB.magenta.toHex()).to.equal('#ff00ff')
      expect(RGB.yellow.toHex()).to.equal('#ffff00')
    })
  })

  describe('#round', function() {
    it('should round each component to 0dp by default', function() {
      expect(new RGB(1.5, 2.2, 3.4).round()).to.be.like(new RGB(2, 2, 3))
    })

    it('should round to arg-dp otherwise', function() {
      expect(new RGB(2.18, 3.41, 4.46).round(1)).to.be.like(new RGB(2.2, 3.4, 4.5))
    })
  })

  describe('#interpolate', function() {
    it('should equal the lhs when percentage = 0', function() {
      for (var repetitions = 0; repetitions < 10; ++repetitions) {
        var left = RGB.random(2), right = RGB.random(2)

        expect(left.interpolate(right, Percent.zero).round(2)).to.be.like(left)
      }
    })

    it('should linerly interpolate between each component separately', function() {
      expect(RGB.white.interpolate(RGB.black, new Percent(0.5)).round()).to.be.like(new RGB(128, 128, 128))
    })
  })
})

describe('ColourSquare', function() {
  var s = new ColourSquare(RGB.green, RGB.cyan, RGB.white, RGB.blue)

  describe('describe', function() {
    it('should include 4 corners', function() {

      expect(s.describe()).to.be.like({
        leftTop:     RGB.green.describe(),
        rightTop:    RGB.cyan.describe(),
        leftBottom:  RGB.white.describe(),
        rightBottom: RGB.blue.describe(),
        name: '<unnamed>'
      })
    })
  })

  it('#left should return left corners', function() {
    expect(s.left()).to.be.like([s.leftTop, s.leftBottom])
  })

  it('#right should return right corners', function() {
    expect(s.right()).to.be.like([s.rightTop, s.rightBottom])
  })

  it('#top should return top corners', function() {
    expect(s.top()).to.be.like([s.leftTop, s.rightTop])
  })

  it('#bottom should return bottom corners', function() {
    expect(s.bottom()).to.be.like([s.leftBottom, s.rightBottom])
  })

  it('colourAt should return colour from left bottom corner', function() {
    expect(s.colourAt(Percent.zero, Percent.zero)).to.be.like(s.leftBottom)
    expect(s.colourAt(Percent.zero, Percent.one)).to.be.like(s.leftTop)
    expect(s.colourAt(Percent.one, Percent.one)).to.be.like(s.rightTop)
    expect(s.colourAt(Percent.one, Percent.zero)).to.be.like(s.rightBottom)
  })

  it('createCanvas should return ColourCanvas', function() {
  })
})

describe('ColourCanvas', function() {
  it('colourXY should return colour at canvas coords', function() {
    var size   = 100
    var square = ColourSquare.random()
    var canvas = new ColourCanvas(size, square, false)

    expect(canvas.colourAt(0,        0)).to.be.like(square.colourAt(Percent.zero, Percent.one))
    expect(canvas.colourAt(size - 1, 0)).to.be.like(square.colourAt(Percent.one, Percent.one))
    expect(canvas.colourAt(size - 1, size - 1)).to.be.like(square.colourAt(Percent.one, Percent.zero))
    expect(canvas.colourAt(0,        size - 1)).to.be.like(square.colourAt(Percent.zero, Percent.zero))
  })
})

describe('ColourCube', function() {
  var front = new ColourSquare("f", "h", "_", "b")
  var back = new ColourSquare("z", "x", "t", "r")
  var cube = new ColourCube(front, back)

  describe('faces', function() {
    it('should make sense', function() {
      expect(cube.front.corners()).to.be.like("fh_b".split(""))
      expect(cube.back.corners()).to.be.like("zxtr".split(""))
      expect(cube.left.corners()).to.be.like("xfr_".split(""))
      expect(cube.right.corners()).to.be.like("hzbt".split(""))
      expect(cube.top.corners()).to.be.like("xzfh".split(""))
      expect(cube.bottom.corners()).to.be.like("trb_".split(""))
    })
  })
})

describe('Letters', function() {
  describe('<>', function() {
    it('should assign values of letters in mapping to this', function() {
      var letters = new Letters({a: 1, aa: 2})

      expect(letters.a).to.be.like(1)
      expect(letters.aa).to.be.like(undefined)
    })
  })

  describe('foreach', function() {
    it('should provide each letter & value', function() {
      var visited = []

      var letters = new Letters({a: 1, b: 2, c: 3})

      letters.foreach(function(letter, value) {
        if (value !== undefined) {
          visited.push([letter, value])
        }
      })

      expect(visited).to.be.like([['a', 1], ['b', 2], ['c', 3]])
    })
  })
})

describe('Letter', function() {
  describe('#add', function() {
    it('should append choice', function() {
      var choiceX = new Choice('face1', 'x', 'y')
      var choiceY = new Choice('face2', 'x', 'y')

      expect(new Letter('z', []).add(choiceX).choices).to.be.like([choiceX])
      expect(new Letter('z', [choiceX]).add(choiceY).choices).to.be.like([choiceX, choiceY])
    })
  })

  describe('#rgb', function() {
    function choice(rgb) {
      return {colour: function() { return rgb }}
    }

    it('should return colour of last choice', function() {
      expect(new Letter('z', [choice(RGB.red)]).rgb()).to.be.like(RGB.red)
      expect(new Letter('z', [choice(RGB.red), choice(RGB.blue)]).rgb()).to.be.like(RGB.blue)
    })
  })
})

describe('LetterCube', function() {
  var lc = new LetterCube()

  describe('corners', function() {
    it('should match expected colours', function() {
      expect(lc.cube.front.corners()).to.be.like([RGB.green, RGB.cyan, RGB.white, RGB.blue])
      expect(lc.cube.back.corners()).to.be.like([RGB.black, RGB.yellow, RGB.magenta, RGB.red])
    })
  })

  describe('letters', function() {
    it('should match expected colours', function() {
      expect(lc.alphabet._.rgb()).to.be.like(RGB.white)
      expect(lc.alphabet.r.rgb()).to.be.like(RGB.red)
      expect(lc.alphabet.f.rgb()).to.be.like(RGB.green)
      expect(lc.alphabet.b.rgb()).to.be.like(RGB.blue)
      expect(lc.alphabet.i.rgb()).to.be.like(RGB.white.interpolate(RGB.red, new Percent(0.5)))
      expect(lc.alphabet.c.rgb()).to.be.like(RGB.white.interpolate(RGB.green, new Percent(0.5)))
      expect(lc.alphabet.a.rgb()).to.be.like(RGB.white.interpolate(RGB.blue, new Percent(0.5)))
    })
  })

  describe('#toHex', function() {
    var actual = lc.toHex()

    it('should match expected colours', function() {
      expect(actual._).to.be.like('#ffffff')
      expect(actual.a).to.be.like('#8080ff')
      expect(actual.b).to.be.like('#0000ff')
      expect(actual.c).to.be.like('#80ff80')
      expect(actual.d).to.be.like('#40bfbf')
      expect(actual.e).to.be.like('#0080ff')
      expect(actual.f).to.be.like('#00ff00')
      expect(actual.g).to.be.like('#2ad555')
      expect(actual.h).to.be.like('#00ffff')
      expect(actual.i).to.be.like('#ff8080')
      expect(actual.j).to.be.like('#bf40bf')
      expect(actual.k).to.be.like('#8000ff')
      expect(actual.l).to.be.like('#bfbf40')
      expect(actual.m).to.be.like('#808080')
      expect(actual.n).to.be.like('#4040bf')
      expect(actual.o).to.be.like('#80ff00')
      expect(actual.p).to.be.like('#40bf40')
      expect(actual.q).to.be.like('#008080')
      expect(actual.r).to.be.like('#ff0000')
      expect(actual.s).to.be.like('#ff0080')
      expect(actual.t).to.be.like('#ff00ff')
      expect(actual.u).to.be.like('#ff8000')
      expect(actual.v).to.be.like('#bf4040')
      expect(actual.w).to.be.like('#800080')
      expect(actual.x).to.be.like('#ffff00')
      expect(actual.y).to.be.like('#808000')
      expect(actual.z).to.be.like('#000000')
    })
  })

  describe('#alphabet', function() {
    it('should do something', function() {
      expect(lc.alphabet.a).to.be.like(new Letter('a', [
        new Choice(lc.cube.front,  0.5, 0),
        new Choice(lc.cube.bottom, 0.5, 0)
      ]))
    })
  })
})

describe('Choice', function() {
  describe('selection', function() {
    it('should contain portion of face', function() {
      function check(x, y, xstart, xend, ystart, yend) {
        var face = {
          squareAt: function(xStart, xEnd, yStart, yEnd) {
            return [new Percent(xStart), new Percent(xEnd), new Percent(yStart), new Percent(yEnd)]
          }
        }

        expect(new Choice(face, x, y).selection()).to.be.like(
          face.squareAt(xstart, xend, ystart, yend))
      }

      check(0,    0,    0,     0.33,  0,     0.33)
      check(0.5,  0.5,  0.33,  0.66,  0.33,  0.66)
      check(1,    1,    0.66,  1,     0.66,  1   )
    })
  })
})
