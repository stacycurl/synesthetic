var options = new Options()

function Radio(name, display, values) {
  this.name = name
  this.display = display
  this.values = values
  this.radios = document.querySelectorAll('input[type="radio"][name="' + this.name + '"]')
}

Radio.prototype = {
  elements: function() {
              /*
    document.makeElement('label'
    document.createElement('label')
    document.createTextNode('...')
    document.createElement('input')
   <label for="gender">Substition Style</label><br/>
   Text   <input name='substitution-style' type='radio' value='text' checked='checked'/><br/>
   Solid  <input name='substitution-style' type='radio' value='solid'/><br/>
   Custom <input name='substitution-style' type='radio' value='custom'/><br/>
   */
  },
  onclick: function(handler) {
    this.radios.foreach(function(radio) {
      radio.addEventListener('click', function(event) {
        handler(event.toElement.value)
      })
    })
  },
  select: function(value) {
    // console.log('radio select', value)
    this.radios.foreach(function(radio) {
      radio.checked = (radio.value == value)
    })
  }
}

var substitutionStyle = new Radio('substitution-style')

options.substitutionStyle.get(function(value) {
  // console.log(value)
  substitutionStyle.select(value)
})

substitutionStyle.onclick(function(value) {
  options.substitutionStyle.set(value)
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

