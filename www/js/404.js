var bg    = document.querySelector('.hero')
var title = document.querySelector('.four-zero-four')

var width  = window.innerWidth
var height = window.innerHeight

window.addEventListener('mousemove', function(e) {
  xPos = (e.x / width) * 110 + 40
  yPos = (e.y / height) * 110
  zPos = 120
  deviceOrientationHandler(xPos, yPos, zPos)
})

function deviceOrientationHandler(a, b, c) {
  var red   = 35 + Math.round(a / 4)  // -180 - 180
  var green = 10 + Math.round(b / 4)  // -90 - 90
  var blue  = 0 + Math.round(c / 8)  // 0 - 360
  var color = 'rgb(' + red + ', ' + green + ', ' + blue + ')'
  bg.style.backgroundColor = color
}

window.onresize = function() {
  width  = window.innerWidth
  height = window.innerHeight
}

