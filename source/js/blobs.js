import colors from './lib/palette'

const canvas = document.querySelector('.js-blob-canvas')
const player = document.querySelector('.js-player')
const playPause = document.querySelector('.js-play-pause')
const context = canvas.getContext('2d')
const palette = [colors.blue, colors.purple, colors.cyan]

var width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let origin = {x: width / 2, y: height / 2}

let blobs = []
let count = 0
let randomCount = 1

window.onresize = () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  origin = {x: width / 2, y: height / 2}
}

playPause.addEventListener('click', (e) => {
  if (player.paused) {
    player.play()
    playPause.classList.add('playing')
  } else {
    playPause.classList.remove('playing')
    player.pause()
  }
})

class Blob {
  constructor () {
    this.x = origin.x
    this.y = origin.y
    this.angle = Math.PI * 2 * Math.random()
    this.vx = (1.3 + Math.random() * .3) * Math.cos(this.angle)
    this.vy = (1.3 + Math.random() * .3) * Math.sin(this.angle)
    this.r = 6 + 3 * Math.random()
    this.color = palette[Math.floor(Math.random() * palette.length)]
  }

  update () {
    this.x += this.vx
    this.y += this.vy
    this.r -= .01
  }
}

let level

let audioContext = new (window.AudioContext || window.webkitAudioContext)
let source = audioContext.createMediaElementSource(player)
let analyser = audioContext.createAnalyser()
analyser.fftSize = 32
let d = new Uint8Array(analyser.frequencyBinCount)
source.connect(analyser)
analyser.connect(audioContext.destination)

loop()

function loop () {
  analyser.getByteFrequencyData(d)
  // low  = d[3] + d[4] + d[5] + d[6]
  // mid  = d[7] + d[8] + d[9] + d[10] + d[11]
  // high = d[12] + d[13] + d[14] + d[15]
  var sum = d.reduce((prev, curr) => prev + curr, 0)
  level = 0
  if (sum > 2100) { level += 1 }
  if (sum > 2200) { level += 1 }
  if (sum > 2300) { level += 1 }
  if (sum > 2400) { level += 1 }

  context.clearRect(0, 0, width, height)

  for (let i = 0; i < level; i++) {
    blobs.push(new Blob())
  }

  for (var i = 0; i < blobs.length; i++) {
    var b = blobs[i]
    context.fillStyle = b.color
    context.beginPath()
    context.arc(b.x, b.y, b.r, 0, Math.PI * 2, false)
    context.fill()
    b.update()
  }

  context.fillStyle = colors.violet
  context.beginPath()

  context.arc(origin.x, origin.y, 40, 0, Math.PI * 2, false)
  context.fill()

  removeBlob()
  requestAnimationFrame(loop)
}

function removeBlob(){
  for(var i = 0; i < blobs.length; i++){
    var b = blobs[i]
    if(
      b.x + b.r < 0 ||
      b.x - b.r > width ||
      b.y + b.r < 0 ||
      b.y - b.r > height ||
      b.r < 0
    ){
      blobs.splice(i, 1)
    }
  }
}
