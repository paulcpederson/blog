import palette from './lib/palette'
import delaunay from 'delaunay-fast'

const canvas = document.querySelector('.js-blob-canvas')
const context = canvas.getContext('2d')

var width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

window.onresize = () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  origin = {x: width / 2, y: height / 2}
}

let dots = []
for (let i = 0; i < 50; i++) {
  dots.push([Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1))])
}

let triangles = delaunay.triangulate(dots)

for (let i = triangles.length; i; ) {
  context.beginPath();
  console.log(i)
  --i; context.moveTo(dots[triangles[i]][0], dots[triangles[i]][1]);
  console.log(i)
  --i; context.lineTo(dots[triangles[i]][0], dots[triangles[i]][1]);
  console.log(i)
  --i; context.lineTo(dots[triangles[i]][0], dots[triangles[i]][1]);
  context.closePath();
  context.stroke();
}


// loop()

// function loop () {
//   context.clearRect(0, 0, width, height)

//   // draw dots
//   for (let i = 0; i < dots.length; i++) {
//     let d = dots[i]
//     context.fillStyle = palette.base1
//     context.beginPath()
//     context.arc(d.x, d.y, 2, 0, Math.PI * 2, false)
//     context.closePath(d.x, d.y, 2, 0, Math.PI * 2, false)
//     context.fill()
//   }

//   // generate all possible lines
//   for (let i = 0; i < dots.length; i++) {
//     let lines = []
//     for (let j = i + 1; j < dots.length; j++) {

//     }
//       context.beginPath()
//       context.strokeStyle = palette.base02
//       context.moveTo(dots[i].x, dots[i].y)
//       context.lineTo(dots[j].x, dots[j].y)
//       context.closePath()
//       context.stroke()
//   }

//   // draw dots
//   for (let i = 0; i < dots.length; i++) {
//     let d = dots[i]
//     context.fillStyle = palette.base1
//     context.beginPath()
//     context.arc(d.x, d.y, 2, 0, Math.PI * 2, false)
//     context.closePath(d.x, d.y, 2, 0, Math.PI * 2, false)
//     context.fill()
//   }

//   requestAnimationFrame(loop)
// }
