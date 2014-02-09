var options = new Options()
var solid = document.querySelector('#solid')

options.isSolid(function(value) {
  solid.checked = value
})

solid.addEventListener('click', function() {
  options.setSolid(solid.checked)
})

var cube = new LetterCube()

// cube.cube.drawUnfolded(document.body, 100)
// console.log(cube.alphabet)
var update = function(letter, rgb) {
  var hex = rgb.toHex();

  [].slice.call(document.querySelectorAll('span.def-' + letter)).foreach(function(def) {
    def.innerHTML = ''
    def.appendChild(document.createTextNode(hex))
  });

  [].slice.call(document.querySelectorAll('span.' + letter)).foreach(function(span) {
    span.style.color = hex

    if (span.getAttribute('solid') == "true") {
      span.style.background = hex
    }
  })
  // console.log([letter, rgb])
}

cube.choiceElements(update).foreach(function(element) {
  document.body.appendChild(element)
})

cube.initial(update)

