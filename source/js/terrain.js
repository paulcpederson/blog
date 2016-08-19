import colors from './lib/palette'

const canvas = document.querySelector('.js-blob-canvas')
const context = canvas.getContext('2d')

const grays = {
  lightest: '#FFFFFF',
  lighter: '#FFFFF8',
  light: '#FFFCF2',
  0: '#F5F2E8',
  dark: '#E5E3DA',
  darker: '#DBD9D0',
  darkest: '#D1CFC6'
}

let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let mouse = {x: width / 2, y: height / 2}

window.onresize = () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
}

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX
  mouse.y = e.clientY
})

function distance (a, b) {
  var dx = a[0] - b[0]
  var dy = a[1] - b[1]
  return Math.sqrt(dx * dx + dy * dy) // pythagoras!
}

const deltas = [-2, -1, 1, 2]

class Vertex {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.originX = x
    this.originY = y
  }
  update () {
    let delta = distance([mouse.x, mouse.y], [this.originX, this.originY])
    if (delta < 150) {
      this.y = this.originY - (100 - delta)
    }
    if (this.x > this.originX) {
      this.x = this.x - 1
    }
    if (this.x < this.originX) {
      this.x = this.x + 1
    }
    if (this.y > this.originY) {
      this.y = this.y - 1
    }
    if (this.y < this.originY) {
      this.y = this.y + 1
    }
    // if (this.x == this.originX && this.y == this.originY) {
    //   this.x = this.originX + (100 * Math.random())
    //   this.y = this.originY + (100 * Math.random())
    // }
  }
}

class Triangle {
  constructor (options) {
    this.a = options.a
    this.b = options.b
    this.c = options.c
    this.fill = colors.base02
    this.orientation = options.orientation

  }

  // shade the triangle based on slope
  shade () {

  }

}

let vertices = []
let triangles = []
const columnWidth = 50
const rowHeight = (columnWidth / 2) * Math.sqrt(3)  // pythagoras!
const columns = Math.floor((width + columnWidth) / columnWidth)
const rows = Math.floor((height + rowHeight) / rowHeight)

// generate vertices
for (let i = -1; i < rows + 2; i++) {
  let row = []
  for (let j = -1; j < columns + 2; j++) {
    let offset = i % 2 ? columnWidth / 2 : 0
    row.push(new Vertex(j * columnWidth - offset, i * rowHeight))
  }
  vertices.push(row)
}

// generate triangles
for (let i = 0; i < vertices.length; i++) {
  let row = vertices[i]
  let nextRow = vertices[i + 1]
  if (nextRow) {
    for (let j = 0; j < row.length; j++){
      if (row[j + 1] && nextRow[j + 1]) {
        if (i % 2 === 0) {
          triangles.push(new Triangle({ a: row[j], b: row[j + 1], c: nextRow[j], orientation: 'south'}))
          triangles.push(new Triangle({ a: row[j + 1], b: nextRow[j + 1], c: nextRow[j], orientation: 'north'}))
        } else {
          triangles.push(new Triangle({ a: row[j], b: nextRow[j + 1], c: nextRow[j], orientation: 'north'}))
          triangles.push(new Triangle({ a: row[j], b: row[j + 1], c: nextRow[j + 1], orientation: 'south'}))
        }
      }
    }
  }
}


function loop () {
  context.clearRect(0, 0, width, height)

  triangles.forEach(t => {
    context.fillStyle = t.fill
    context.strokeStyle = colors.blue
    context.beginPath()
    context.moveTo(t.a.x, t.a.y)
    context.lineTo(t.b.x, t.b.y)
    context.lineTo(t.c.x, t.c.y)
    context.lineTo(t.a.x, t.a.y)
    context.fill()
    context.stroke()
  })

  vertices.forEach(row => {
    row.forEach(v => {
      context.fillStyle = colors.blue
      context.beginPath()
      context.arc(v.x, v.y, 2, 0, Math.PI * 2, false)
      context.fill()
    })
  })

  vertices.forEach(row => {
    row.forEach(v => {
      v.update()
    })
  })

  requestAnimationFrame(loop)
}

loop()
