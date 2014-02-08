var options = new Options()
var solid = document.querySelector('#solid')

options.isSolid(function(value) {
  solid.checked = value
})

solid.addEventListener('click', function() { options.setSolid(solid.checked) })

