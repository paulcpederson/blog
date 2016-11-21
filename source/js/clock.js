let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let origin = { x: width / 2, y: height / 2 }
let radius = 240

window.onresize = () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  origin = { x: width / 2, y: height / 2 }
}

// loop()

// function loop () {

//   requestAnimationFrame(loop)
// }
