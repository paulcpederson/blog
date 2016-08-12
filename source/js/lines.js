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

class Point {
  constructor () {
    this.x = Math.floor(Math.random() * (width + 1))
    this.y = Math.floor(Math.random() * (height + 1))
    this.angle = Math.PI * 2 * Math.random()
    this.vx = (1.3 + Math.random() * .3) * Math.cos(this.angle)
    this.vy = (1.3 + Math.random() * .3) * Math.sin(this.angle)
  }

  update () {
    this.x += this.vx
    this.y += this.vy
  }
}

let points = []
for (let i = 0; i < 50; i++) {
  points.push(new Point())
}

loop()

function loop () {
  context.clearRect(0, 0, width, height)

  let triangles = delaunay.triangulate(points.map(p => [p.x, p.y]))

  for (let i = triangles.length; i; ) {
    context.beginPath()
    --i;
    context.moveTo(points[triangles[i]].x, points[triangles[i]].y)
    --i;
    context.lineTo(points[triangles[i]].x, points[triangles[i]].y)
    --i;
    context.lineTo(points[triangles[i]].x, points[triangles[i]].y)
    context.closePath()
    context.stroke()
    // logic to determine direction of triangle/shading
    // context.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    // context.fill()
  }

  for (let i = 0; i < points.length; i++) {
    let p = points[i]
    context.fillStyle = palette.base1
    context.beginPath()
    context.arc(p.x, p.y, 2, 0, Math.PI * 2, false)
    context.closePath()
    context.fill()
    p.update()
  }

  requestAnimationFrame(loop)
}
