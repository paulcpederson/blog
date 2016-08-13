import colors from './lib/palette'

const canvas = document.querySelector('.js-blob-canvas')
const context = canvas.getContext('2d')

var width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

window.onresize = () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
}

class Vertex {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

class Triangle {
  constructor (a, b, c) {
    this.a = a
    this.b = b
    this.c = c
  }
}

let vertices = []
let triangles = []
const columnWidth = 50
const rowHeight = (columnWidth / 2) * Math.sqrt(3)  // pythagoras!
const columns = Math.floor((width + columnWidth) / columnWidth)
const rows = Math.floor((height + rowHeight) / rowHeight)

// generate vertices
for (let i = -1; i < rows + 1; i++) {
  let row = []
  for (let j = -1; j < columns + 1; j++) {
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
          triangles.push(new Triangle(row[j], row[j + 1], nextRow[j]))
          triangles.push(new Triangle(row[j + 1], nextRow[j], nextRow[j + 1]))
        } else {
          triangles.push(new Triangle(row[j], nextRow[j], nextRow[j+1]))
          triangles.push(new Triangle(row[j], row[j+1], nextRow[j + 1]))
        }
      }
    }
  }
}


function loop () {
  context.clearRect(0, 0, width, height)

  triangles.forEach(t => {
    context.fillStyle = colors.base02
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

  requestAnimationFrame(loop)
}

loop()
