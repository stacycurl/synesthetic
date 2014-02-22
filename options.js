var options = new Options()

function Radio(name, display, values) {
  this.name = name
}

Radio.prototype = {
  radios: function() {
    return document.querySelectorAll('input[type="radio"][name="' + this.name + '"]')
  },
  onclick: function(handler) {
    this.radios().forEach(function(radio) {
      radio.addEventListener('click', function(event) {
        handler(event.toElement.value)
      })
    })
  },
  select: function(value) {
    // console.log('radio select', value)
    this.radios().forEach(function(radio) {
      // console.log('Radio.select.radio', radio, value, radio.value)
      radio.checked = (radio.value == value)
    })
  }
}

//var substitutionScheme = new Radio('substitution-scheme', 'Substitution Scheme', ['Ternary', 'Colour'])
//substitutionScheme.addTo('#options')
//var substitutionStyle = new Radio('substitution-style')


options.substitutionStyle.get(function(value) {
  // console.log(value)
  //substitutionStyle.select(value)
})

/*
substitutionStyle.onclick(function(value) {
  options.substitutionStyle.set(new Letters({}).map(function(letter) {
    return value
  }))
})
*/

var cube = new LetterCube()

// cube.cube.drawUnfolded(document.body, 100)
// console.log(cube.alphabet)
var update = function(letter, rgb) {
  var hex = rgb.toHex();

  document.querySelectorAll('span.def-' + letter).forEach(function(def) {
    def.innerHTML = ''
    def.appendChild(document.createTextNode(hex))
  });

  document.querySelectorAll('span.' + letter).forEach(function(span) {
    span.style.color = hex

    if (span.getAttribute('solid') == "true") {
      span.style.background = hex
    }
  })
  // console.log([letter, rgb])
}

options.substitutionStyle.get(function(substitutionStyle) {
  cube.choiceElements(update, options, new Letters(substitutionStyle)).forEach(function(element) {
    document.body.appendChild(element)
  })

  cube.initial(update)
})


