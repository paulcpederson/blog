import palette from './lib/palette'
import delaunay from 'delaunay-fast'

const colors = Object.keys(palette).map(key => palette[key])
const canvas = document.querySelector('.js-blob-canvas')
const context = canvas.getContext('2d')

var width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

window.onresize = () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  origin = {x: width / 2, y: height / 2}
}
const deltas = [-2, -1, 1, 2]
class Point {
  constructor () {
    this.x = Math.floor(Math.random() * (width + 1))
    this.y = Math.floor(Math.random() * (height + 1))
    this.dx = deltas[Math.floor(Math.random() * deltas.length)]
    this.dy = deltas[Math.floor(Math.random() * deltas.length)]
  }

  update () {
    if (this.x + this.dx > width - 2 || this.x + this.dx < 2) {
      this.dx = -this.dx
    }

    if (this.y + this.dy > height - 2 || this.y + this.dy < 2) {
      this.dy = -this.dy
    }

    this.x += this.dx
    this.y += this.dy
  }
}

let points = []
for (let i = 0; i < 50; i++) {
  points.push(new Point())
}

let blues = [
  '#268BD2',
  '#237FBF',
  '#1F73AD',
  '#1C679C',
  '#185987'
]

loop()

function loop () {
  context.clearRect(0, 0, width, height)

  let triangles = delaunay.triangulate(points.map(p => [p.x, p.y]))

  for (let i = triangles.length; i; ) {
    context.beginPath()
    i--
    context.moveTo(points[triangles[i]].x, points[triangles[i]].y)
    i--
    context.lineTo(points[triangles[i]].x, points[triangles[i]].y)
    i--
    context.lineTo(points[triangles[i]].x, points[triangles[i]].y)
    context.closePath()

    // logic to determine direction of triangle/shading
    // context.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    // context.fill()
    context.fillStyle = palette.base02
    context.strokeStyle = palette.green
    context.stroke()
    context.fill()
  }

  for (let i = 0; i < points.length; i++) {
    // let p = points[i]
    // context.fillStyle = palette.base00
    // context.beginPath()
    // context.arc(p.x, p.y, 2, 0, Math.PI * 2, false)
    // context.closePath()
    // context.fill()
    points[i].update()
  }

  requestAnimationFrame(loop)
}
