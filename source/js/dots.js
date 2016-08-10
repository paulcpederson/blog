import colors from './lib/palette'

const canvas = document.querySelector('.js-blob-canvas')
const context = canvas.getContext('2d')
const palette = Object.keys(colors).map(key => colors[key])

var width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let origin = {x: width / 2, y: height / 2}
let delta = {x: 0, y: 0}

let dots = []

window.onresize = () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  origin = {x: width / 2, y: height / 2}
  generateDots()
}

window.addEventListener('mousemove', (e) => {
  delta = {
    x: e.clientX - origin.x,
    y: e.clientY - origin.y
  }
})

class Dot {
  constructor () {
    this.x = Math.floor(Math.random() * (width + 100)) - 49
    this.y = Math.floor(Math.random() * (height + 100)) - 49
    this.r = 3 * Math.random()
    this.color = palette[Math.floor(Math.random() * palette.length)]
  }
}

function generateDots () {
  let totalDots = Math.floor(width / 40 * height / 40)
  dots = []

  for (let i = 0; i < totalDots; i++) {
    dots.push(new Dot())
  }

  // sort on radius so that larger dots look closer
  dots = dots.sort((a,b) => a.r - b.r)
}

generateDots()

loop()

function loop () {
  context.clearRect(0, 0, width, height)
  for (var i = 0; i < dots.length; i++) {
    var d = dots[i]
    context.fillStyle = d.color
    context.beginPath()

    let x = d.x + (delta.x * d.r * .1)
    let y = d.y + (delta.y * d.r * .1)

    context.arc(x, y, d.r, 0, Math.PI * 2, false)
    context.fill()
  }

  requestAnimationFrame(loop)
}
